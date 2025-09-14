# Email Notification Setup Instructions

## Overview

Your Aqua Marina application has email notification functionality that sends alerts to `abdulkalam081998@gmail.com` when new orders are placed. Here's how to set it up and troubleshoot issues.

## Current Status

✅ **Database Triggers**: Automatically log email notifications when orders are created  
✅ **Edge Function**: Ready to send emails via Resend API  
✅ **Frontend Integration**: OrderForm calls notification function  
✅ **Admin Email**: Set to `abdulkalam081998@gmail.com`  

## Quick Setup Steps

### 1. Get a Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `re_`)

### 2. Configure the API Key

Replace the placeholder in your `.env` file:

```bash
# In .env file
RESEND_API_KEY="re_your_actual_api_key_here"
```

### 3. Deploy Supabase Functions (if using Supabase CLI)

```bash
# If you have Supabase CLI installed
supabase functions deploy send-admin-notification
```

### 4. Alternative: Test Without Resend

The system will automatically log email content to console if no API key is configured. Check the browser developer tools or function logs.

## Testing Email Notifications

### Method 1: Place a Test Order
1. Go to your application at `http://localhost:8080`
2. Sign in with `abdulkalam081998@gmail.com`
3. Add items to cart and place an order
4. Check email or function logs

### Method 2: Use Test Script
```bash
# Run the test script
python test_email.py
```

### Method 3: Check Database Logs
1. Go to admin dashboard
2. Check the `email_notifications` table for logged attempts

## Troubleshooting

### No Emails Received?

1. **Check API Key**: Ensure `RESEND_API_KEY` is set correctly
2. **Check Spam Folder**: Email might be in spam/junk
3. **Check Function Logs**: Look at Supabase function logs
4. **Check Database**: Look at `email_notifications` table

### Error: "Function not found"

- Supabase functions need to be deployed
- Check if local Supabase is running
- Verify function name is correct

### Database Trigger Issues

Check the database trigger is working:

```sql
-- Check if trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'send_order_notification_trigger';

-- Check logged notifications
SELECT * FROM email_notifications 
ORDER BY created_at DESC 
LIMIT 10;
```

## Email Service Alternatives

If Resend doesn't work, you can modify the edge function to use:

- **SendGrid**: Replace Resend import with SendGrid
- **Nodemailer**: For SMTP-based sending
- **Webhook**: Send to external service
- **SMS**: Use Twilio for SMS notifications instead

## Development vs Production

### Development
- Uses console logging if no API key
- Local Supabase functions
- Test with fake data

### Production
- Requires real Resend API key
- Deployed Supabase functions
- Real customer data

## Contact

If you need help setting up email notifications:
1. Check the function logs in Supabase dashboard
2. Verify your Resend account is active
3. Test with the provided test script

---

**Note**: The system will continue to work without email notifications - orders will still be saved and visible in the admin dashboard. Email notifications are an additional feature for convenience.
