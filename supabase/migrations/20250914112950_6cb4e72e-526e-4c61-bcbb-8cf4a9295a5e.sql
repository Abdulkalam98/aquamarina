-- Create or replace the handle_new_user function to use the new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, email, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.phone,
        CASE 
            WHEN NEW.email = 'abdulkalam081998@gmail.com' THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$function$;