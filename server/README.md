# White Elephant Party - Backend API

Express.js backend for handling RSVPs, codename registry, and admin guest list.

## 🚀 Quick Start

### Local Development

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

### Deploy to Railway

1. **Create a new Railway project:**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `white-elephant-party` repository
   - Railway will auto-detect the server folder

2. **Configure Environment Variables:**
   In Railway dashboard, add these variables:
   ```
   ADMIN_PASSWORD=your-secure-password-here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```

3. **Deploy:**
   - Railway will automatically build and deploy
   - You'll get a URL like: `https://your-app.up.railway.app`

4. **Update Frontend:**
   Add the Railway URL to your frontend `.env`:
   ```
   VITE_API_URL=https://your-app.up.railway.app
   ```

## 📡 API Endpoints

### Public Endpoints

**Health Check**
```
GET /api/health
```

**Check Codename Availability**
```
GET /api/codename/check/:codename
Response: { available: boolean, codename: string }
```

**Register Codename**
```
POST /api/codename/register
Body: { codename: string }
Response: { success: boolean, codename: string }
```

**Submit RSVP**
```
POST /api/rsvp
Body: {
  name: string,
  email: string,
  phone?: string,
  codename?: string,
  attending: 'yes' | 'no',
  guests?: number,
  dietaryRestrictions?: string,
  wantsReminders?: boolean
}
Response: { success: boolean, message: string }
```

### Admin Endpoints

**Get Guest List**
```
GET /api/guest-list
Headers: { Authorization: 'Bearer YOUR_ADMIN_PASSWORD' }
Response: { rsvps: [...], stats: {...} }
```

**Get All Codenames**
```
GET /api/codenames
Headers: { Authorization: 'Bearer YOUR_ADMIN_PASSWORD' }
Response: { codenames: [...] }
```

## 💾 Database

Uses SQLite by default (perfect for Railway's persistent volumes).

**Tables:**
- `rsvps` - Guest RSVPs with all form data
- `codenames` - Registry of all assigned codenames (ensures uniqueness)

Railway automatically persists the SQLite database file.

## 🔒 Security

- CORS configured for your frontend domain
- Admin endpoints require password authentication
- Input validation on all endpoints
- Unique constraints on emails and codenames

## 🛠️ Development

**Test the API:**
```bash
# Health check
curl http://localhost:3001/api/health

# Check codename
curl http://localhost:3001/api/codename/check/Jolly%20Bells

# Register codename
curl -X POST http://localhost:3001/api/codename/register \
  -H "Content-Type: application/json" \
  -d '{"codename":"Sparkle Mittens"}'

# Submit RSVP
curl -X POST http://localhost:3001/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Ryan",
    "email":"ryan@example.com",
    "codename":"Jolly Boots",
    "attending":"yes",
    "guests":2
  }'

# Get guest list (admin)
curl http://localhost:3001/api/guest-list \
  -H "Authorization: Bearer your-admin-password"
```

## 📊 Database Management

The SQLite database file is stored at `server/party.db`. On Railway, this is automatically persisted.

To reset the database:
```bash
rm party.db party.db-shm party.db-wal
npm start  # Will recreate with fresh schema
```

## 🎯 Railway Deployment Checklist

- [ ] Push server code to GitHub
- [ ] Create Railway project from GitHub repo
- [ ] Set `ADMIN_PASSWORD` environment variable
- [ ] Set `FRONTEND_URL` environment variable
- [ ] Deploy and get Railway URL
- [ ] Update frontend `.env` with `VITE_API_URL`
- [ ] Test RSVP submission
- [ ] Test admin guest list access
- [ ] Verify codename uniqueness works

## 🔄 Updates

To deploy updates:
```bash
git add .
git commit -m "Update backend"
git push
```

Railway will automatically redeploy!
