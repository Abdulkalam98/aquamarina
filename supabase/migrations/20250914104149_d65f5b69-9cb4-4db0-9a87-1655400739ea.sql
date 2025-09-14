-- Update the profiles table to support phone authentication
ALTER TABLE public.profiles 
ADD COLUMN phone TEXT,
ALTER COLUMN email DROP NOT NULL;

-- Update the handle_new_user function to work with phone authentication
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, email, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.phone,
        CASE 
            WHEN NEW.phone = '+1234567890' THEN 'admin'  -- Replace with actual admin phone
            WHEN NEW.email = 'admin@aquamarina.com' THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$function$;