import { createClient } from '@supabase/supabase-js';

// Use the service role key for admin operations (you'd need this for checking auth.users)
// Since we don't have service role key, let's just manually create admin profile for existing users

const supabase = createClient(
  'https://dtiijjkhpmehyinbvjrq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aWlqamtocG1laHlpbmJ2anJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDM4MzcsImV4cCI6MjA3MzQxOTgzN30.-628OUJt2Goxw9tQgqbvAmwUK9yQfT6THUOf1T-t56U'
);

async function createTestAdminProfile() {
  try {
    console.log('Creating test admin profile...');
    
    // First let's try to sign up a regular user and then manually update their role
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'testadmin@example.com',
      password: 'admin123!',
      options: {
        data: {
          full_name: 'Test Administrator'
        }
      }
    });
    
    if (signUpError) {
      console.error('Error creating test admin:', signUpError);
    } else {
      console.log('Test admin created:', signUpData);
      
      if (signUpData.user) {
        // Try to update the profile to admin
        console.log('Trying to manually create admin profile...');
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: signUpData.user.id,
              email: signUpData.user.email,
              role: 'admin'
            }
          ])
          .select();
        
        if (profileError) {
          console.error('Error creating admin profile:', profileError);
        } else {
          console.log('Admin profile created successfully:', profileData);
        }
      }
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

createTestAdminProfile();
