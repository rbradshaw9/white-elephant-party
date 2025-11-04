/**
 * Database setup and queries
 * Uses simple JSON file storage for development
 * Railway will provide PostgreSQL for production
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, 'data.json');

// Initialize database
let db = { rsvps: [], codenames: [] };

/**
 * Load database from file
 */
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error);
    db = { rsvps: [], codenames: [] };
  }
}

/**
 * Save database to file
 */
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

/**
 * Initialize database
 */
export function initDatabase() {
  loadDatabase();
  console.log('✅ Database initialized');
  console.log(`   RSVPs: ${db.rsvps.length}`);
  console.log(`   Codenames: ${db.codenames.length}`);
}

/**
 * RSVP Queries
 */
export const rsvpQueries = {
  // Create or update RSVP
  upsert: (name, email, phone, codename, attending, guests, dietaryRestrictions, wantsReminders) => {
    const existingIndex = db.rsvps.findIndex(r => r.email === email);
    const rsvp = {
      name,
      email,
      phone: phone || null,
      codename: codename || null,
      attending,
      guests: attending === 'yes' ? (guests || 1) : 1,
      dietary_restrictions: dietaryRestrictions || null,
      wants_reminders: wantsReminders ? 1 : 0,
      submitted_at: existingIndex >= 0 ? db.rsvps[existingIndex].submitted_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      db.rsvps[existingIndex] = rsvp;
    } else {
      db.rsvps.push(rsvp);
    }
    
    saveDatabase();
    return { changes: 1 };
  },

  // Get all RSVPs
  getAll: () => db.rsvps.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)),

  // Get RSVPs by status
  getByStatus: (status) => db.rsvps
    .filter(r => r.attending === status)
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)),

  // Get single RSVP by email
  getByEmail: (email) => db.rsvps.find(r => r.email === email),

  // Get stats
  getStats: () => {
    const total = db.rsvps.length;
    const attending = db.rsvps.filter(r => r.attending === 'yes').length;
    const notAttending = db.rsvps.filter(r => r.attending === 'no').length;
    const totalGuests = db.rsvps
      .filter(r => r.attending === 'yes')
      .reduce((sum, r) => sum + (r.guests || 1), 0);

    return {
      total,
      attending,
      not_attending: notAttending,
      total_guests: totalGuests
    };
  },

  // Delete RSVP (for testing)
  delete: (email) => {
    const index = db.rsvps.findIndex(r => r.email === email);
    if (index >= 0) {
      db.rsvps.splice(index, 1);
      saveDatabase();
      return { changes: 1 };
    }
    return { changes: 0 };
  }
};

/**
 * Codename Queries
 */
export const codenameQueries = {
  // Check if codename is taken
  isTaken: (codename) => {
    const count = db.codenames.filter(c => c.codename === codename).length;
    return { count };
  },

  // Register a codename
  register: (codename) => {
    if (!db.codenames.find(c => c.codename === codename)) {
      db.codenames.push({
        codename,
        assigned_at: new Date().toISOString()
      });
      saveDatabase();
      return { changes: 1 };
    }
    throw new Error('UNIQUE constraint failed: codenames.codename');
  },

  // Get all codenames
  getAll: () => db.codenames.sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at)),

  // Unregister a codename (for testing)
  unregister: (codename) => {
    const index = db.codenames.findIndex(c => c.codename === codename);
    if (index >= 0) {
      db.codenames.splice(index, 1);
      saveDatabase();
      return { changes: 1 };
    }
    return { changes: 0 };
  },

  // Clear all codenames (for testing/reset)
  clearAll: () => {
    db.codenames = [];
    saveDatabase();
    return { changes: 1 };
  }
};

/**
 * Helper function to check codename availability
 */
export function isCodenameTaken(codename) {
  const result = codenameQueries.isTaken(codename);
  return result.count > 0;
}

/**
 * Helper function to register codename
 */
export function registerCodename(codename) {
  try {
    codenameQueries.register(codename);
    return true;
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return false; // Already taken
    }
    throw error;
  }
}

export default db;
