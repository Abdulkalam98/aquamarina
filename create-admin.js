import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dtiijjkhpmehyinbvjrq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aWlqamtocG1laHlpbmJ2anJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDM4MzcsImV4cCI6MjA3MzQxOTgzN30.-628OUJt2Goxw9tQgqbvAmwUK9yQfT6THUOf1T-t56U'
);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'admin123!',
      options: {
        data: {
          full_name: 'Administrator'
        }
      }
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
    } else {
      console.log('Admin user created successfully:', data);
      
      // Wait a moment for the trigger to run
      setTimeout(async () => {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', 'admin@aquamarina.com');
        
        if (profileError) {
          console.error('Error checking profile:', profileError);
        } else {
          console.log('Admin profile created:', profiles);
        }
      }, 2000);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

createAdminUser();
