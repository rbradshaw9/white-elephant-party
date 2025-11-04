# Supabase Integration Guide

## 🎯 Overview

The Great Gift Heist 2025 uses Supabase as the backend database for:
- Agent registration and RSVP tracking
- Conversation logs from HQ Terminal
- AI session history for adaptive learning
- Global HQ transmissions

---

## 🗄️ Database Schema

### `agents` Table
Stores all registered agents and their mission details.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key, auto-generated |
| `created_at` | timestamptz | Registration timestamp |
| `real_name` | text | Agent's actual name |
| `codename` | text | Assigned operational codename (unique) |
| `attendance_status` | text | `attending`, `not_attending`, or `uncertain` |
| `guest_count` | int | Number of additional guests (0 = solo) |
| `guest_names` | text[] | Array of guest names |
| `email` | text | Contact email (optional) |
| `phone` | text | Contact phone (optional) |
| `access_code` | text | Code used to gain entry |
| `conversation_log` | jsonb | Full chat history from HQ Terminal |
| `rsvp_confirmed_at` | timestamptz | When RSVP was finalized |
| `agent_card_url` | text | URL to generated agent card (future) |

**Indexes:**
- Primary key on `id`
- Unique constraint on `codename`

---

### `ai_sessions` Table
Stores AI chat sessions for learning and context.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `agent_id` | uuid | Foreign key to `agents.id` |
| `messages` | jsonb | Array of chat messages |
| `rating` | int | Optional 1-5 star rating |
| `last_active_at` | timestamptz | Last interaction time |

**Relationships:**
- `agent_id` references `agents(id)`

---

### `transmissions` Table
Global messages from HQ (announcements, updates).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `created_at` | timestamptz | Creation time |
| `type` | text | `announcement`, `warning`, `intel` |
| `message` | text | Transmission content |
| `active` | boolean | Whether to display |
| `language` | text | Message language (default: `en`) |

---

## 🔌 Connection Setup

### Environment Variables

Add to `.env`:

```bash
VITE_SUPABASE_URL=https://tirlwlgqkcczxpcrilaj.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** The key shown is the anon/public key. Never commit `.env` to git.

### Client Initialization

```javascript
// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 📝 Usage Examples

### Save a New Agent

```javascript
import { saveAgent } from './utils/saveAgentData';

const agentData = {
  real_name: 'John Doe',
  codename: 'Frosty Gift',
  attendance_status: 'attending',
  guest_count: 2,
  guest_names: ['Jane Doe', 'Kid Doe'],
  access_code: 'RED-SLEIGH-2025',
  conversation_log: [...messages],
};

const savedAgent = await saveAgent(agentData);
console.log('Agent ID:', savedAgent.id);
```

### Get Agent by Codename

```javascript
import { getAgentByCodename } from './utils/saveAgentData';

const agent = await getAgentByCodename('Frosty Gift');
if (agent) {
  console.log('Found agent:', agent.real_name);
}
```

### Get All Attending Agents

```javascript
import { getAttendingAgents } from './utils/saveAgentData';

const agents = await getAttendingAgents();
console.log(`${agents.length} agents confirmed`);
```

### Save Chat Session

```javascript
import { saveAISession } from './utils/saveAISession';

const messages = [
  { sender: 'HQ', text: 'Welcome, agent!' },
  { sender: 'USER', text: 'Thanks!' },
];

await saveAISession(agentId, messages);
```

---

## 🎨 HQ Terminal Flow

The `HQTerminal` component manages the entire onboarding chat:

1. **Greeting** - Welcomes agent to North Pole Intelligence
2. **Name Collection** - Asks for real name
3. **Personality Quiz** - 3 questions to profile the agent
4. **Codename Generation** - Creates unique codename based on answers
5. **Codename Confirmation** - Agent can accept or regenerate
6. **Mission Briefing** - Shows operation details
7. **RSVP** - Collects attendance (yes/no/maybe)
8. **Guest Count** - If attending, asks how many guests
9. **Guest Names** - Collects names of additional operatives
10. **Save to Database** - Stores everything in Supabase
11. **Agent Card** - Redirects to `/agent/:codename`

### State Machine

```
greeting → name → personality → codename_gen → codename_confirm 
    → rsvp → guests_count → guest_names → complete
```

---

## 🎖️ Agent Card

View any agent's credentials at `/agent/:codename`

Features:
- Displays codename, real name, status
- Shows mission briefing if attending
- Lists guest names
- PDF download functionality
- Links to Google Maps for location

---

## 🔐 Security & RLS

Supabase Row Level Security (RLS) policies:

### `agents` Table
- **SELECT**: Public (anyone can read agent roster)
- **INSERT**: Public (anyone can register)
- **UPDATE**: Restricted (only agents can update their own record)
- **DELETE**: Admin only

### `ai_sessions` Table
- **SELECT**: Public (for loading past conversations)
- **INSERT**: Public (for saving chat logs)
- **UPDATE**: Restricted
- **DELETE**: Admin only

### `transmissions` Table
- **SELECT**: Public (anyone can read announcements)
- **INSERT/UPDATE/DELETE**: Admin only

---

## 📊 Admin Dashboard (Future)

Planned features:
- View all RSVPs in real-time
- Read conversation logs
- Send global transmissions
- Export guest list as CSV
- View analytics (attendance rate, guest counts, etc.)

Route: `/admin/hq-dashboard`

---

## 🚀 Deployment Checklist

- [ ] Supabase project created
- [ ] Tables created with correct schema
- [ ] RLS policies enabled and tested
- [ ] Environment variables set in Vercel
- [ ] `.env` added to `.gitignore`
- [ ] Test agent registration flow
- [ ] Verify agent card generation
- [ ] Check roster displays correctly

---

## 🐛 Troubleshooting

### "Agent not found" Error
- Check codename spelling (case-sensitive)
- Verify agent was saved to database
- Check Supabase dashboard for record

### Connection Failed
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_KEY
- Check network connectivity
- Confirm Supabase project is active

### Data Not Saving
- Check browser console for errors
- Verify RLS policies allow INSERT
- Ensure required fields are provided

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🔄 Migration from Railway Backend

The previous JSON file database on Railway is being replaced with Supabase for:
- Better scalability
- Real-time subscriptions (future)
- Simpler authentication
- Built-in admin panel

Existing data can be migrated using the `/scripts/migrate-to-supabase.js` script (if needed).

---

## ✅ Testing

### Test Agent Registration

1. Go to `/access`
2. Enter code: `RED-SLEIGH-2025`
3. Complete HQ Terminal chat
4. Verify agent appears in Supabase dashboard
5. Check agent card at `/agent/YOUR-CODENAME`
6. Confirm agent shows in `/roster`

### Verify Database Connection

```javascript
import { testSupabaseConnection } from './utils/supabaseClient';

await testSupabaseConnection(); // Should log "✅ Supabase connected successfully"
```

---

**Last Updated:** November 4, 2025  
**Supabase Project:** `tirlwlgqkcczxpcrilaj`  
**Database Version:** 1.0
