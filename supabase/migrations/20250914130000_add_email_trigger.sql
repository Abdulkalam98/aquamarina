-- Add email notification trigger for new orders
-- This ensures emails are sent automatically when orders are created

-- Create a function to send email notifications via HTTP request
CREATE OR REPLACE FUNCTION public.send_order_notification()
RETURNS TRIGGER AS $$
DECLARE
    notification_payload jsonb;
BEGIN
    -- Prepare the notification payload
    notification_payload := jsonb_build_object(
        'orderId', NEW.id,
        'customerName', NEW.full_name,
        'customerPhone', NEW.phone,
        'customerEmail', NEW.email,
        'products', jsonb_build_array(
            jsonb_build_object(
                'name', split_part(NEW.product, ' - ', 1),
                'size', split_part(NEW.product, ' - ', 2),
                'quantity', NEW.quantity,
                'price', NEW.total_cost / NEW.quantity
            )
        ),
        'totalCost', NEW.total_cost,
        'deliveryAddress', NEW.address,
        'deliveryDate', NEW.delivery_date,
        'deliveryTime', NEW.delivery_time,
        'specialInstructions', NEW.special_instructions,
        'serviceType', NEW.service_type
    );

    -- Call the edge function (this will work when Supabase is properly configured)
    -- For now, we'll just log the order
    RAISE LOG 'New order created: %', notification_payload;
    
    -- Insert into a notifications table for tracking
    INSERT INTO public.email_notifications (
        order_id,
        email_type,
        recipient_email,
        payload,
        status,
        created_at
    ) VALUES (
        NEW.id,
        'admin_order_notification',
        'abdulkalam081998@gmail.com',
        notification_payload,
        'pending',
        NOW()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create email notifications tracking table
CREATE TABLE IF NOT EXISTS public.email_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    email_type TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    payload JSONB,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on email notifications
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for email notifications (only admins can view)
CREATE POLICY "Admins can manage email notifications" 
ON public.email_notifications 
FOR ALL 
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- Create trigger for email notifications
CREATE TRIGGER update_email_notifications_updated_at
    BEFORE UPDATE ON public.email_notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create the trigger on orders table
DROP TRIGGER IF EXISTS send_order_notification_trigger ON public.orders;
CREATE TRIGGER send_order_notification_trigger
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.send_order_notification();

-- Create a function to process pending email notifications
CREATE OR REPLACE FUNCTION public.process_pending_email_notifications()
RETURNS void AS $$
DECLARE
    notification_record RECORD;
    function_result jsonb;
BEGIN
    -- Get all pending notifications
    FOR notification_record IN 
        SELECT * FROM public.email_notifications 
        WHERE status = 'pending' 
        ORDER BY created_at ASC
        LIMIT 10
    LOOP
        BEGIN
            -- Try to call the edge function
            SELECT content::jsonb INTO function_result
            FROM http((
                'POST',
                current_setting('app.supabase_url') || '/functions/v1/send-admin-notification',
                ARRAY[
                    http_header('Authorization', 'Bearer ' || current_setting('app.supabase_anon_key')),
                    http_header('Content-Type', 'application/json')
                ],
                notification_record.payload::text
            ));

            -- Mark as sent if successful
            UPDATE public.email_notifications 
            SET 
                status = 'sent',
                sent_at = NOW(),
                updated_at = NOW()
            WHERE id = notification_record.id;

        EXCEPTION WHEN OTHERS THEN
            -- Mark as failed with error message
            UPDATE public.email_notifications 
            SET 
                status = 'failed',
                error_message = SQLERRM,
                updated_at = NOW()
            WHERE id = notification_record.id;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
