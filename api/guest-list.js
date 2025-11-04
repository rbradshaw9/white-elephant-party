// Vercel Serverless Function to retrieve guest list
// This is a simple implementation - for production, use a real database

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Simple file-based storage (will work on Vercel with /tmp directory)
const STORAGE_PATH = '/tmp/rsvps.json';

// Helper to read RSVPs from storage
async function readRSVPs() {
  try {
    const data = await readFile(STORAGE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Helper to write RSVPs to storage
async function writeRSVPs(rsvps) {
  await writeFile(STORAGE_PATH, JSON.stringify(rsvps, null, 2));
}

export default async function handler(req, res) {
  // Simple authentication - use a secret key
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.ADMIN_SECRET || 'change-this-secret';
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      // Return all RSVPs
      const rsvps = await readRSVPs();
      
      // Sort by submission date (newest first)
      const sorted = rsvps.sort((a, b) => 
        new Date(b.submittedAt) - new Date(a.submittedAt)
      );
      
      // Calculate stats
      const attending = rsvps.filter(r => r.attending === 'yes');
      const totalGuests = attending.reduce((sum, r) => sum + parseInt(r.guests || 1), 0);
      
      return res.status(200).json({
        rsvps: sorted,
        stats: {
          total: rsvps.length,
          attending: attending.length,
          notAttending: rsvps.length - attending.length,
          totalGuests,
        }
      });
      
    } else if (req.method === 'POST') {
      // Add a new RSVP (called from rsvp.js)
      const rsvp = {
        ...req.body,
        submittedAt: new Date().toISOString(),
      };
      
      const rsvps = await readRSVPs();
      rsvps.push(rsvp);
      await writeRSVPs(rsvps);
      
      return res.status(200).json({ success: true });
      
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Error managing guest list:', error);
    return res.status(500).json({ 
      error: 'Failed to manage guest list',
      details: error.message 
    });
  }
}
