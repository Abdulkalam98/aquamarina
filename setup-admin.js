import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dtiijjkhpmehyinbvjrq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aWlqamtocG1laHlpbmJ2anJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDM4MzcsImV4cCI6MjA3MzQxOTgzN30.-628OUJt2Goxw9tQgqbvAmwUK9yQfT6THUOf1T-t56U'
);

async function setupAdminProfile() {
  try {
    console.log('Setting up admin profile for abdulkalam081998@gmail.com...');
    
    // First, let's try to sign in as the admin user to get their user ID
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'abdulkalam081998@gmail.com',
      password: 'YourPasswordHere' // You'll need to replace this with the actual password
    });
    
    if (signInError) {
      console.log('Could not sign in (this is expected if we dont have the password):', signInError.message);
      console.log('We will create a profile manually instead...');
      
      // Try to create profile manually - this might fail if we don't have the user_id
      // But we can check if profile already exists
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'abdulkalam081998@gmail.com');
      
      if (checkError) {
        console.error('Error checking existing profiles:', checkError);
      } else {
        console.log('Existing profiles for admin email:', existingProfiles);
        
        if (existingProfiles.length === 0) {
          console.log('No profile found. You need to:');
          console.log('1. Sign in to the app with abdulkalam081998@gmail.com');
          console.log('2. This will trigger the profile creation');
          console.log('3. Or run the migration to update the trigger function');
        } else {
          // Update existing profile to admin
          const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('email', 'abdulkalam081998@gmail.com')
            .select();
          
          if (updateError) {
            console.error('Error updating profile to admin:', updateError);
          } else {
            console.log('Successfully updated profile to admin:', updateData);
          }
        }
      }
    } else {
      console.log('Successfully signed in as admin');
      
      if (signInData.user) {
        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', signInData.user.id);
        
        if (profileError) {
          console.error('Error checking profile:', profileError);
        } else if (existingProfile.length === 0) {
          // Create profile
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: signInData.user.id,
                email: signInData.user.email,
                role: 'admin'
              }
            ])
            .select();
          
          if (createError) {
            console.error('Error creating admin profile:', createError);
          } else {
            console.log('Admin profile created successfully:', newProfile);
          }
        } else {
          // Update existing profile
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('user_id', signInData.user.id)
            .select();
          
          if (updateError) {
            console.error('Error updating profile:', updateError);
          } else {
            console.log('Admin profile updated successfully:', updatedProfile);
          }
        }
        
        // Sign out after setup
        await supabase.auth.signOut();
      }
    }
    
    // Final check - see all profiles
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('*');
    
    if (allError) {
      console.error('Error fetching all profiles:', allError);
    } else {
      console.log('All profiles in database:');
      allProfiles.forEach(profile => {
        console.log(`- ${profile.email}: ${profile.role} (ID: ${profile.user_id})`);
      });
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

setupAdminProfile();
