# 🚂 Railway Deployment Guide

Complete guide to deploying the White Elephant Party backend to Railway.

## 📋 Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Your code pushed to GitHub

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Backend

Your backend is already set up in the `server/` directory. Make sure it's committed to Git:

```bash
cd /path/to/white-elephant-party
git add server/
git commit -m "Add Express backend for Railway deployment"
git push origin main
```

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select the `white-elephant-party` repository

### 3. Configure Root Directory

Since your backend is in a subdirectory, you need to tell Railway:

1. In your Railway project, go to **Settings**
2. Under **Build & Deploy**, set:
   - **Root Directory**: `server`
   - **Start Command**: `npm start` (should auto-detect)

### 4. Set Environment Variables

In Railway project **Variables** tab, add:

```bash
ADMIN_PASSWORD=your-secure-admin-password-here
NODE_ENV=production
```

**Important:** Choose a strong admin password! This protects your guest list.

### 5. Deploy!

Railway will automatically:
- Detect it's a Node.js project
- Run `npm install`
- Start the server with `npm start`

Your backend will be live at: `https://your-project.up.railway.app`

### 6. Test Your Deployment

```bash
# Test health check
curl https://your-project.up.railway.app/api/health

# Should return:
# {"status":"ok","message":"White Elephant Party API","timestamp":"..."}
```

## 🔧 Update Frontend

### 1. Add Backend URL to Frontend

Edit `/path/to/white-elephant-party/.env`:

```bash
VITE_API_URL=https://your-project.up.railway.app
```

### 2. Deploy Frontend to Vercel

In Vercel, add the environment variable:
- Key: `VITE_API_URL`
- Value: `https://your-project.up.railway.app`

Redeploy your Vercel project.

### 3. Update Backend CORS

Back in Railway, add your Vercel URL to the variables:

```bash
FRONTEND_URL=https://your-vercel-app.vercel.app
```

This allows your frontend to make API requests.

## 📊 Database Persistence

Railway automatically persists your SQLite database file (`party.db`) even across deployments. No extra configuration needed!

## 🧪 Testing the Full Stack

### Test Codename System

```bash
# Check if codename is available
curl https://your-project.up.railway.app/api/codename/check/Jolly%20Boots

# Register a codename
curl -X POST https://your-project.up.railway.app/api/codename/register \
  -H "Content-Type: application/json" \
  -d '{"codename":"Sparkle Mittens"}'
```

### Test RSVP Submission

```bash
curl -X POST https://your-project.up.railway.app/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "codename": "Jolly Boots",
    "attending": "yes",
    "guests": 2,
    "dietaryRestrictions": "Vegetarian"
  }'
```

### Test Admin Guest List

```bash
curl https://your-project.up.railway.app/api/guest-list \
  -H "Authorization: Bearer your-admin-password"
```

## 🔐 Security Checklist

- [ ] Strong admin password set in Railway variables
- [ ] `FRONTEND_URL` configured for CORS
- [ ] `.env` files added to `.gitignore` (never commit secrets!)
- [ ] Test admin authentication works
- [ ] Verify only your frontend can make requests

## 📈 Monitoring

Railway provides:
- **Logs**: View real-time server logs
- **Metrics**: CPU, memory, network usage
- **Deployments**: History of all deployments

Access these in your Railway project dashboard.

## 🔄 Updating Your Backend

To deploy updates:

```bash
# Make changes to server code
git add server/
git commit -m "Update backend feature"
git push origin main
```

Railway automatically redeploys! 🎉

## 🆘 Troubleshooting

### Backend won't start
- Check Railway logs for errors
- Verify `package.json` has correct start script
- Ensure root directory is set to `server`

### CORS errors in browser
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check Railway logs for CORS-related messages
- Make sure frontend has correct `VITE_API_URL`

### Database not persisting
- Railway automatically persists files
- If issues persist, contact Railway support
- Consider upgrading to PostgreSQL for production

### Admin password not working
- Double-check `ADMIN_PASSWORD` variable in Railway
- Make sure no extra spaces in the password
- Try clearing localStorage in browser

## 🎯 Production Checklist

Before going live:

- [ ] Backend deployed to Railway ✅
- [ ] Frontend updated with Railway URL ✅
- [ ] CORS configured correctly ✅
- [ ] Strong admin password set ✅
- [ ] Test RSVP submission works ✅
- [ ] Test admin guest list access ✅
- [ ] Test codename uniqueness ✅
- [ ] Monitor logs for any errors ✅

## 💡 Pro Tips

1. **Custom Domain**: Railway supports custom domains in Settings
2. **PostgreSQL**: For production, consider upgrading to Railway's PostgreSQL
3. **Backups**: Export guest list CSV regularly
4. **Monitoring**: Set up Railway notifications for deploy failures

---

Need help? Check Railway's excellent docs at [docs.railway.app](https://docs.railway.app)
