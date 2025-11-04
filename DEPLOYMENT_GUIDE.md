# 🚀 Deployment Guide

## Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables and add:

### Required Variables

```bash
# Supabase (Primary Database)
VITE_SUPABASE_URL=https://tirlwlgqkcczxpcrilaj.supabase.co
VITE_SUPABASE_KEY=<GET_FROM_SUPABASE_DASHBOARD>

# OpenAI (Codename Generation - Optional)
VITE_OPENAI_API_KEY=<YOUR_OPENAI_KEY>

# Railway Backend (Legacy Admin Panel - Optional)
VITE_API_URL=https://white-elephant-party-production.up.railway.app
```

---

## 📍 How to Get Supabase Keys

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select project: `tirlwlgqkcczxpcrilaj`
3. Click "Settings" (gear icon) → "API"
4. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Publishable API key** → `VITE_SUPABASE_KEY`

**⚠️ IMPORTANT:** Use the **publishable** key (starts with `sb_publishable_...`), NOT the secret key!

---

## 🔄 Railway Deployment

Railway auto-deploys from the `/server` directory. No Supabase variables needed.

### Railway Environment Variables (Already Set)
```bash
PORT=8080  # Auto-set by Railway
ADMIN_PASSWORD=red-sleigh-admin-2025
FRONTEND_URL=https://white-elephant-party.vercel.app
```

---

## ✅ Deployment Checklist

### Before Deploying

- [ ] Update `.env` locally with correct Supabase key
- [ ] Test locally: `npm run dev`
- [ ] Verify Supabase connection works
- [ ] Test HQ Terminal chat flow
- [ ] Confirm agent card generation

### Vercel Deployment

1. **Add Environment Variables**
   ```
   Vercel Dashboard → Your Project → Settings → Environment Variables
   ```
   
2. **Add All 4 Variables**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`  
   - `VITE_OPENAI_API_KEY`
   - `VITE_API_URL`

3. **Apply to All Environments**
   - Production ✅
   - Preview ✅  
   - Development ✅

4. **Redeploy**
   ```bash
   git push
   ```
   Or manually trigger redeploy in Vercel dashboard.

### Railway Deployment

Railway auto-deploys when you push to `main`. No action needed.

---

## 🧪 Testing Production

After deployment, test this flow:

1. **Access Gate**
   - Go to `/access`
   - Enter code: `RED-SLEIGH-2025`
   - Should see terminal boot sequence

2. **HQ Terminal Chat**
   - Complete conversation flow
   - Provide name, answer questions
   - Accept/regenerate codename
   - Choose attendance
   - Add guests (if attending)

3. **Agent Card**
   - Should redirect to `/agent/YOUR-CODENAME`
   - Card should display with all info
   - Download PDF should work

4. **Agent Roster**
   - Go to `/roster`
   - Should see your agent listed
   - Click your card → Should navigate to `/agent/:codename`

5. **Returning Agent**
   - Clear browser cookies/localStorage
   - Enter access code again
   - Should say "Welcome back, Agent [Your Codename]"

---

## 🐛 Troubleshooting

### "Supabase connection failed"
- ✅ Check environment variables in Vercel
- ✅ Verify Supabase project is active
- ✅ Check browser console for CORS errors
- ✅ Confirm you're using anon key, not service_role

### "Agent not found" on card page
- ✅ Check Supabase dashboard → agents table
- ✅ Verify agent was saved (check created_at timestamp)
- ✅ Try direct URL: `/agent/YOUR-EXACT-CODENAME`

### Railway not deploying
- ✅ Check Railway dashboard for build logs
- ✅ Verify `railway.toml` exists in root
- ✅ Confirm `server/package.json` has correct start script

### Quiz not appearing after access code
- ✅ Check that `validationState` changes to 'quiz'
- ✅ Verify `handleSubmit` logic in AccessGate.jsx
- ✅ Look for console errors

---

## 📊 Monitoring

### Supabase Dashboard
Check agent registrations:
```
https://supabase.com/dashboard/project/tirlwlgqkcczxpcrilaj/editor/TABLE_NAME
```

### Vercel Analytics
Monitor deployment status and errors:
```
https://vercel.com/[your-team]/white-elephant-party
```

### Railway Logs
View backend logs:
```
https://railway.app/project/[your-project]/service/[your-service]/logs
```

---

## 🔐 Security Notes

1. **Never commit `.env` to git** - Already in `.gitignore` ✅
2. **Use anon key for frontend** - Service role key must stay secret
3. **Row Level Security enabled** - Supabase tables are protected
4. **Admin password** - Stored in Railway env vars only

---

## 🎯 Post-Deployment Tasks

### Immediate
- [ ] Test full registration flow
- [ ] Verify Supabase receives data
- [ ] Check agent cards generate correctly
- [ ] Confirm roster displays agents

### Optional
- [ ] Set up Supabase email triggers (for RSVP confirmations)
- [ ] Create admin dashboard in Supabase
- [ ] Add real-time subscriptions for roster updates
- [ ] Migrate AdminGuestList to Supabase queries

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check Supabase logs
3. Check Railway logs (if using admin panel)
4. Review AUDIT_REPORT.md for known issues

---

**Last Updated:** November 4, 2025  
**Deployment Status:** Ready for production ✅
