# 🚀 Production Deployment Checklist

## ✅ Completed (Code is Ready)

- [x] Fixed HQTerminal redirect bug
- [x] Removed og-image 401 errors  
- [x] Created gallery folder structure
- [x] All imports verified (no broken dependencies)
- [x] Error handling reviewed (all Supabase calls have try/catch)
- [x] Created complete database schema (supabase-schema.sql)
- [x] Committed and pushed all changes to GitHub

---

## ⏳ Required Manual Steps (You Must Do These)

### 1. Create Supabase Database Tables

**Steps:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/tirlwlgqkcczxpcrilaj)
2. Click "SQL Editor" in left sidebar
3. Click "New query"
4. Open `supabase-schema.sql` from your repo
5. Copy entire contents and paste into SQL Editor
6. Click "Run" button
7. Verify success message (should see "Success. No rows returned")

**Verify Tables Created:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('agents', 'ai_sessions', 'transmissions');
```

Should return 3 rows.

---

### 2. Add Environment Variables to Vercel

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your "white-elephant-party" project
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar
5. Add these 4 variables (one at a time):

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://tirlwlgqkcczxpcrilaj.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Name: VITE_SUPABASE_KEY
Value: sb_publishable_3BH4G8yrV8iwvOiXMFdC2A_7ltL9uOa
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 3:**
```
Name: VITE_OPENAI_API_KEY
Value: [YOUR_OPENAI_API_KEY_FROM_.ENV]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 4:**
```
Name: VITE_API_URL
Value: https://white-elephant-party-production.up.railway.app
Environments: ✅ Production ✅ Preview ✅ Development
```

6. Click "Save" after adding each variable
7. After all 4 are added, trigger a redeploy:
   - Go to "Deployments" tab
   - Click "..." menu on latest deployment
   - Click "Redeploy"

---

### 3. (Optional) Upload Gallery Images

**When you have photos/videos:**
1. Place files in `public/gallery/` folder:
   ```
   public/gallery/2024-1.jpg
   public/gallery/2024-2.jpg
   public/gallery/2024-video-1.mp4
   ```

2. Create thumbnail versions in `public/gallery/thumbs/`:
   ```
   public/gallery/thumbs/2024-1.jpg (300x300px)
   public/gallery/thumbs/2024-2.jpg
   public/gallery/thumbs/2024-video-1-thumb.jpg
   ```

3. Commit and push:
   ```bash
   git add public/gallery/
   git commit -m "Add party photos and videos"
   git push
   ```

Vercel will auto-deploy with the new media.

---

## 🧪 Testing After Deployment

Once Supabase tables are created and Vercel env vars are added:

### Test Flow:
1. Visit https://white-elephant-party.vercel.app/access
2. Enter code: `RED-SLEIGH-2025`
3. Complete HQ Terminal chat:
   - Provide your name
   - Answer personality questions
   - Accept or regenerate codename
   - Choose attendance (yes/no/maybe)
   - Add guests (if yes)
4. Should redirect to `/agent/YOUR-CODENAME`
5. Download PDF - should work
6. Visit `/roster` - should see your agent listed
7. Clear localStorage and revisit `/access`
8. Should say "Welcome back, Agent [Your Codename]"

### Verify Database:
1. Go to Supabase Dashboard → Table Editor
2. Check `agents` table - should see your test registration
3. Check `ai_sessions` table - should see your chat log

---

## 🐛 Troubleshooting

### "Table 'agents' does not exist"
- You didn't run `supabase-schema.sql` in Supabase Dashboard
- Go back to Step 1 above

### "Supabase connection failed"
- Check Vercel environment variables are set correctly
- Verify you used the **publishable** key, not secret key
- Trigger a Vercel redeploy after adding env vars

### "Access Denied" / 401 errors
- Check Supabase RLS policies are enabled
- Run this in SQL Editor:
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE tablename IN ('agents', 'ai_sessions', 'transmissions');
  ```
  All should show `rowsecurity = true`

### Quiz redirects to home instead of HQ Terminal
- This is FIXED in latest commit (05c4501)
- Make sure Vercel deployed the latest version
- Check deployment logs

### Images/videos not showing in Gallery
- This is expected until you upload media to `public/gallery/`
- Gallery will work once you add files (see Step 3 above)

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend Code | ✅ Ready | All bugs fixed, pushed to GitHub |
| Supabase Schema | ⏳ Manual | Run `supabase-schema.sql` in dashboard |
| Vercel Env Vars | ⏳ Manual | Add 4 variables to Vercel |
| Railway Backend | ✅ Working | Admin panel only, no changes needed |
| Gallery Media | ❌ Empty | Upload when ready (optional) |

---

## 🎯 Next Steps Summary

1. **Run `supabase-schema.sql` in Supabase Dashboard** (5 min)
2. **Add env vars to Vercel** (5 min)
3. **Redeploy Vercel** (automatic after step 2)
4. **Test complete user flow** (5 min)

Total time: ~15 minutes

After these steps, your site will be 100% functional in production! 🎉

---

## 📞 Need Help?

- Check `SUPABASE_INTEGRATION.md` for detailed Supabase docs
- Check `DEPLOYMENT_GUIDE.md` for deployment instructions
- Check `AUDIT_REPORT.md` for architecture overview

All documentation is in your repo root.
