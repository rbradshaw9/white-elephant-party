# White Elephant Party 2025 - RSVP Backend Setup

## What's Been Added

I've implemented a complete backend system for RSVP management:

### ✅ Features Implemented

1. **Email Confirmations** - Guests receive a beautiful HTML email when they RSVP
   - Personalized confirmation with all party details
   - Reminder preference noted
   - Different templates for "Yes" vs "No" responses

2. **Admin Notifications** - jenny.bradshaw@gmail.com receives an email for every RSVP
   - Clean table format with all guest information
   - Instant notifications when people submit

3. **Guest List Management** - Secure admin panel to view all RSVPs
   - Live stats (attending, not attending, total guests)
   - Full table with all RSVP details
   - CSV export functionality
   - Password protected at `/admin/guest-list`

4. **Storage** - All RSVPs are saved to a file-based system
   - Works on Vercel's serverless platform
   - No database required (uses `/tmp` directory)

### 📁 New Files Created

- `api/rsvp.js` - Handles RSVP form submissions and sends emails
- `api/guest-list.js` - Manages guest list storage and retrieval
- `src/pages/AdminGuestList.jsx` - Admin dashboard to view RSVPs
- Updated `src/pages/RSVP.jsx` - Now submits to real backend
- Updated `src/App.jsx` - Added admin route

### 🚀 Deployment Instructions

#### Step 1: Set Up SendGrid

1. Create a free SendGrid account: https://signup.sendgrid.com/
2. Verify your sender email (the "from" address for emails)
3. Create an API key: https://app.sendgrid.com/settings/api_keys
   - Click "Create API Key"
   - Choose "Restricted Access"
   - Enable "Mail Send" permissions
   - Copy the API key (you won't see it again!)

#### Step 2: Configure Vercel Environment Variables

When deploying to Vercel, add these environment variables in your project settings:

```
SENDGRID_API_KEY=your_actual_api_key_from_sendgrid
SENDER_EMAIL=your-verified-email@yourdomain.com
ADMIN_SECRET=create-a-secure-password-here
```

**To add in Vercel:**
1. Go to your project dashboard on Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable above
4. Redeploy for changes to take effect

#### Step 3: Deploy

```bash
# Commit all changes
git add .
git commit -m "Add RSVP backend with SendGrid integration"
git push

# Deploy to Vercel (if not auto-deployed)
# The API routes will automatically work as serverless functions
```

### 🔐 Accessing the Guest List

Navigate to: `https://your-site.vercel.app/admin/guest-list`

Enter the password you set in `ADMIN_SECRET` environment variable.

### 📧 Email Templates

**Guest Confirmation Email:**
- Beautiful gradient header
- Party details (date, time, location)
- What to bring (gift, food, competitive spirit!)
- Reminder preference confirmation
- Mobile-friendly HTML design

**Admin Notification Email:**
- Clean table with all RSVP info
- Quick yes/no status
- Guest count and dietary restrictions
- Timestamp

### 💡 Future Enhancements (Optional)

If you want to add SMS reminders later, you can integrate Twilio:
- Create a Twilio account
- Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` to env vars
- Modify `api/rsvp.js` to send SMS using Twilio SDK

### 🔧 Local Development

To test locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your actual values

# Run locally with serverless functions
vercel dev
```

### 📊 Storage Note

**Current Setup:** RSVPs are stored in Vercel's `/tmp` directory
- **Pros:** No database needed, free, works immediately
- **Cons:** Data persists but may be cleared during cold starts
- **For Production:** Consider upgrading to:
  - Google Sheets API (free, persistent, easy)
  - Vercel KV (Redis-based, fast)
  - Supabase (PostgreSQL, free tier)

### ✨ What Happens When Someone RSVPs:

1. User submits form on `/rsvp` page
2. Frontend sends POST request to `/api/rsvp`
3. Backend validates data
4. Sends confirmation email to guest
5. Sends notification email to jenny.bradshaw@gmail.com
6. Stores RSVP in guest list storage
7. Returns success to frontend
8. User sees success screen with calendar download

### 🎯 Next Steps

1. Deploy to Vercel with environment variables configured
2. Test RSVP submission
3. Check your email (and Jenny's) for confirmations
4. Visit `/admin/guest-list` to view submissions
5. Share the link with your friends!

Let me know if you need help with SendGrid setup or want to implement persistent storage!
