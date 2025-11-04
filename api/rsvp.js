// Vercel Serverless Function for RSVP submissions
// Install: npm install @sendgrid/mail

import sendgrid from '@sendgrid/mail';

// Configure SendGrid with your API key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, guests, dietaryRestrictions, attending, reminderPreference } = req.body;

    // Validate required fields
    if (!name || !email || !attending) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email to guest (RSVP confirmation)
    const guestEmailContent = {
      to: email,
      from: process.env.SENDER_EMAIL || 'noreply@yourdomain.com', // Verified sender in SendGrid
      subject: `White Elephant Party 2025 - RSVP ${attending === 'yes' ? 'Confirmed' : 'Received'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 White Elephant Party 2025</h1>
            </div>
            <div class="content">
              ${attending === 'yes' ? `
                <h2>You're In, ${name}! 🎉</h2>
                <p><strong>Party Details:</strong></p>
                <ul>
                  <li><strong>Date:</strong> Saturday, December 13, 2025</li>
                  <li><strong>Time:</strong> 6:30 PM</li>
                  <li><strong>Location:</strong> Ryan's Place (address in calendar invite)</li>
                  <li><strong>Guests:</strong> ${guests} ${parseInt(guests) === 1 ? 'person' : 'people'}</li>
                  ${dietaryRestrictions ? `<li><strong>Dietary Notes:</strong> ${dietaryRestrictions}</li>` : ''}
                </ul>
                
                <p><strong>What to Bring:</strong></p>
                <ul>
                  <li>🎁 A wrapped gift ($20-40)</li>
                  <li>🍲 Optional: Something to share (we're making chili!)</li>
                  <li>😈 Your competitive spirit</li>
                </ul>
                
                <p><strong>Reminders:</strong> ${
                  reminderPreference === 'week' ? "We'll remind you one week before!" :
                  reminderPreference === 'day' ? "We'll remind you one day before!" :
                  reminderPreference === 'both' ? "We'll send reminders one week and one day before!" :
                  "No reminders - you're on your own! 🤞"
                }</p>
                
                <p style="margin-top: 20px;">Can't wait to see what ridiculous gift you bring! 🎅</p>
              ` : `
                <h2>Thanks for letting us know, ${name}</h2>
                <p>Sorry you can't make it to the White Elephant Party this year. We'll miss you!</p>
                <p>Maybe next year? 🎄</p>
              `}
            </div>
            <div class="footer">
              <p>Questions? Reply to this email or contact Ryan.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Email to Jenny (notification)
    const notificationEmail = {
      to: 'jenny.bradshaw@gmail.com',
      from: process.env.SENDER_EMAIL || 'noreply@yourdomain.com',
      subject: `🎁 New RSVP: ${name} ${attending === 'yes' ? '✅ Attending' : '❌ Not Attending'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New RSVP Received</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Name</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Email</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${email}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Attending</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${attending === 'yes' ? '✅ YES' : '❌ NO'}</td>
            </tr>
            ${attending === 'yes' ? `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Guests</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${guests}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Dietary Restrictions</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${dietaryRestrictions || 'None'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Reminder Preference</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${reminderPreference}</td>
            </tr>
            ` : ''}
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Submitted</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    // Send both emails
    await sendgrid.send(guestEmailContent);
    await sendgrid.send(notificationEmail);

    // Store RSVP in guest list
    try {
      await fetch(`${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/guest-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ADMIN_SECRET || 'change-this-secret'}`,
        },
        body: JSON.stringify(req.body),
      });
    } catch (storageError) {
      console.error('Failed to store RSVP:', storageError);
      // Don't fail the request if storage fails
    }

    // Return success
    return res.status(200).json({ 
      success: true, 
      message: 'RSVP submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing RSVP:', error);
    return res.status(500).json({ 
      error: 'Failed to process RSVP',
      details: error.message 
    });
  }
}
