import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dtiijjkhpmehyinbvjrq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aWlqamtocG1laHlpbmJ2anJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDM4MzcsImV4cCI6MjA3MzQxOTgzN30.-628OUJt2Goxw9tQgqbvAmwUK9yQfT6THUOf1T-t56U'
);

async function checkProfiles() {
  try {
    console.log('Checking profiles table...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      console.log('Profiles found:', JSON.stringify(data, null, 2));
      
      // Check for admin users
      const admins = data.filter(profile => profile.role === 'admin');
      console.log('\nAdmin users:');
      admins.forEach(admin => {
        console.log(`- ${admin.email || admin.user_id}: ${admin.role}`);
      });
      
      if (admins.length === 0) {
        console.log('No admin users found!');
      }
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkProfiles();
