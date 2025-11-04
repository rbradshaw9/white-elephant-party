/**
 * White Elephant Party - Backend API
 * Handles RSVPs, codename registry, and guest list
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, rsvpQueries, codenameQueries, isCodenameTaken, registerCodename } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

// Initialize database
initDatabase();

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'White Elephant Party API',
    timestamp: new Date().toISOString()
  });
});

/**
 * Check if codename is available
 * GET /api/codename/check/:codename
 */
app.get('/api/codename/check/:codename', (req, res) => {
  try {
    const { codename } = req.params;
    const taken = isCodenameTaken(codename);
    
    res.json({ 
      available: !taken,
      codename 
    });
  } catch (error) {
    console.error('Error checking codename:', error);
    res.status(500).json({ error: 'Failed to check codename availability' });
  }
});

/**
 * Register a codename
 * POST /api/codename/register
 * Body: { codename: string }
 */
app.post('/api/codename/register', (req, res) => {
  try {
    const { codename } = req.body;
    
    if (!codename || typeof codename !== 'string') {
      return res.status(400).json({ error: 'Codename is required' });
    }

    const success = registerCodename(codename);
    
    if (!success) {
      return res.status(409).json({ 
        error: 'Codename already taken',
        available: false 
      });
    }

    res.json({ 
      success: true, 
      codename,
      message: 'Codename registered successfully'
    });
  } catch (error) {
    console.error('Error registering codename:', error);
    res.status(500).json({ error: 'Failed to register codename' });
  }
});

/**
 * Submit RSVP
 * POST /api/rsvp
 */
app.post('/api/rsvp', (req, res) => {
  try {
    const { name, email, phone, codename, attending, guests, dietaryRestrictions, wantsReminders } = req.body;

    // Validation
    if (!name || !email || !attending) {
      return res.status(400).json({ error: 'Name, email, and attendance are required' });
    }

    if (!['yes', 'no'].includes(attending)) {
      return res.status(400).json({ error: 'Attending must be "yes" or "no"' });
    }

    // Insert or update RSVP
    rsvpQueries.upsert(
      name,
      email,
      phone || null,
      codename || null,
      attending,
      attending === 'yes' ? (guests || 1) : 1,
      dietaryRestrictions || null,
      wantsReminders ? 1 : 0
    );

    // If they have a codename and are attending, register it
    if (codename && attending === 'yes') {
      registerCodename(codename);
    }

    res.json({ 
      success: true,
      message: 'RSVP submitted successfully',
      rsvp: {
        name,
        email,
        codename,
        attending
      }
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    
    if (error.message.includes('UNIQUE constraint failed: rsvps.codename')) {
      return res.status(409).json({ error: 'Codename already taken by another guest' });
    }
    
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});

/**
 * Get guest list (admin only)
 * GET /api/guest-list
 * Requires Authorization header with admin password
 */
app.get('/api/guest-list', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (token !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const rsvps = rsvpQueries.getAll();
    const stats = rsvpQueries.getStats();

    // Format for frontend
    const formattedRsvps = rsvps.map(rsvp => ({
      name: rsvp.name,
      email: rsvp.email,
      phone: rsvp.phone,
      codename: rsvp.codename,
      attending: rsvp.attending,
      guests: rsvp.guests,
      dietaryRestrictions: rsvp.dietary_restrictions,
      reminderPreference: rsvp.wants_reminders ? 'Yes' : 'No',
      submittedAt: rsvp.submitted_at,
      updatedAt: rsvp.updated_at
    }));

    res.json({
      rsvps: formattedRsvps,
      stats: {
        total: stats.total,
        attending: stats.attending,
        notAttending: stats.not_attending,
        totalGuests: stats.total_guests
      }
    });
  } catch (error) {
    console.error('Error fetching guest list:', error);
    res.status(500).json({ error: 'Failed to fetch guest list' });
  }
});

/**
 * Get all registered codenames (for debugging)
 * GET /api/codenames
 */
app.get('/api/codenames', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (token !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const codenames = codenameQueries.getAll();
    res.json({ codenames });
  } catch (error) {
    console.error('Error fetching codenames:', error);
    res.status(500).json({ error: 'Failed to fetch codenames' });
  }
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🎄 White Elephant Party API Server                    ║
║                                                          ║
║   Status: OPERATIONAL                                   ║
║   Port: ${PORT}                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                  ║
║                                                          ║
║   Endpoints:                                            ║
║   • GET  /api/health                                    ║
║   • GET  /api/codename/check/:name                      ║
║   • POST /api/codename/register                         ║
║   • POST /api/rsvp                                      ║
║   • GET  /api/guest-list (admin)                        ║
║   • GET  /api/codenames (admin)                         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  process.exit(0);
});
