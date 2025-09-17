-- Update the trigger function to recognize abdulkalam081998@gmail.com as admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, role)
    VALUES (
        NEW.id,
        NEW.email,
        CASE 
            WHEN NEW.email = 'abdulkalam081998@gmail.com' THEN 'admin'
            WHEN NEW.email = 'admin@aquamarina.com' THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Also create/update profile for existing user if they don't have one
INSERT INTO public.profiles (user_id, email, role)
SELECT 
    id,
    email,
    CASE 
        WHEN email = 'abdulkalam081998@gmail.com' THEN 'admin'
        WHEN email = 'admin@aquamarina.com' THEN 'admin'
        ELSE 'user'
    END
FROM auth.users 
WHERE email = 'abdulkalam081998@gmail.com'
AND id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT (user_id) DO UPDATE SET 
    role = CASE 
        WHEN EXCLUDED.email = 'abdulkalam081998@gmail.com' THEN 'admin'
        WHEN EXCLUDED.email = 'admin@aquamarina.com' THEN 'admin'
        ELSE 'user'
    END;
