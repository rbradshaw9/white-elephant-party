import EVENT_CONFIG from './config';

/**
 * Email Templates for RSVP Confirmations and Reminders
 * Supports both Party and Heist themes
 */

// Helper to calculate days until event
const getDaysUntil = () => {
  const now = new Date();
  const eventDate = new Date(EVENT_CONFIG.date + 'T' + EVENT_CONFIG.time);
  const diffTime = eventDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * HEIST THEME - Confirmation Email
 */
export const heistConfirmationTemplate = (data) => {
  const { name, codename, email } = data;
  const firstName = name.split(' ')[0];
  const daysUntil = getDaysUntil();

  return {
    subject: `Mission Accepted, Agent ${firstName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #020617; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0f172a; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #0ea5e9; }
    .banner { background: linear-gradient(90deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%); color: #fecaca; padding: 10px; text-align: center; font-size: 12px; letter-spacing: 2px; border-bottom: 2px solid #dc2626; }
    .content { padding: 30px 20px; color: #e2e8f0; }
    .codename-box { background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%); border: 2px solid #0ea5e9; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
    .codename { font-size: 28px; font-weight: bold; color: #38bdf8; letter-spacing: 3px; margin: 10px 0; }
    .mission-details { background: #1e293b; padding: 20px; margin: 20px 0; border-left: 4px solid #0ea5e9; border-radius: 4px; }
    .detail-row { margin: 10px 0; }
    .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .value { color: #f1f5f9; font-size: 16px; font-weight: bold; margin-top: 5px; }
    .whatsapp-btn { display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { background: #0f172a; padding: 20px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; }
    .countdown { font-size: 24px; color: #fbbf24; font-weight: bold; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Classification Banner -->
    <div class="banner">
      ⚠️ CLASSIFIED TRANSMISSION — ACCESS LEVEL 7 — OPERATION SANTA'S MANIFEST ⚠️
    </div>

    <!-- Header -->
    <div class="header">
      <h1 style="margin: 0; color: white; font-size: 32px; text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);">
        MISSION ACCEPTED
      </h1>
      <p style="margin: 10px 0 0 0; color: #bae6fd; font-size: 14px; letter-spacing: 2px;">
        NORTH POLE INTELLIGENCE DIVISION
      </p>
    </div>

    <!-- Content -->
    <div class="content">
      <p style="font-size: 16px; line-height: 1.6;">
        Agent <strong>${firstName}</strong>, your clearance has been confirmed.
      </p>

      <!-- Codename Assignment -->
      <div class="codename-box">
        <div class="label" style="color: #7dd3fc;">ASSIGNED CODENAME</div>
        <div class="codename">${codename}</div>
        <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 13px;">
          This is your operational identifier for the mission
        </p>
      </div>

      <!-- Mission Details -->
      <div class="mission-details">
        <h2 style="margin: 0 0 20px 0; color: #38bdf8; font-size: 20px;">
          📋 MISSION PARAMETERS
        </h2>
        
        <div class="detail-row">
          <div class="label">Mission Start</div>
          <div class="value">December 13, 2025 @ 1900 hours (7:00 PM ${EVENT_CONFIG.timezone})</div>
        </div>

        <div class="detail-row">
          <div class="label">HQ Location</div>
          <div class="value">${EVENT_CONFIG.location.name}</div>
          <div style="color: #94a3b8; font-size: 14px; margin-top: 5px;">
            ${EVENT_CONFIG.location.address}, ${EVENT_CONFIG.location.city}, ${EVENT_CONFIG.location.state}
          </div>
        </div>

        <div class="detail-row">
          <div class="label">Required Equipment</div>
          <div class="value">
            🎁 One wrapped decoy package (value: $${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max})<br>
            🕶️ Disguise optional, confidence mandatory
          </div>
        </div>
      </div>

      <!-- Countdown -->
      <div style="text-align: center; margin: 30px 0;">
        <div class="label">MISSION LAUNCH IN</div>
        <div class="countdown">T-minus ${daysUntil} days</div>
      </div>

      ${EVENT_CONFIG.whatsapp.enabled ? `
      <!-- WhatsApp Group -->
      <div style="background: #1e293b; padding: 25px; margin: 20px 0; text-align: center; border-radius: 8px; border: 2px solid #0ea5e9;">
        <h3 style="margin: 0 0 10px 0; color: #38bdf8;">🔐 ENCRYPTED COMMS NETWORK</h3>
        <p style="color: #cbd5e1; font-size: 14px; margin: 10px 0;">
          Join the operational WhatsApp network for live updates, code drops, and mission chaos.
        </p>
        <a href="${EVENT_CONFIG.whatsapp.inviteLink}" class="whatsapp-btn">
          📱 Join Secret Channel
        </a>
      </div>
      ` : ''}

      <!-- Additional Instructions -->
      <div style="background: #422006; border: 2px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 8px;">
        <div style="color: #fbbf24; font-weight: bold; margin-bottom: 10px;">⚠️ CRITICAL REMINDER</div>
        <div style="color: #fde68a; font-size: 14px; line-height: 1.6;">
          Intelligence suggests punctuality is critical. Late arrivals may miss the initial briefing.
          Ensure your decoy package is properly concealed (wrapped). The mission director will tolerate no shortcuts.
        </div>
      </div>

      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-top: 30px;">
        We'll send tactical updates as the mission date approaches. Stay sharp, Agent ${firstName}.
      </p>

      <p style="color: #64748b; font-size: 13px; margin-top: 30px; font-style: italic;">
        — Santa's Black Ops Division<br>
        North Pole Intelligence Command
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 5px 0;">Questions? Contact mission control: ${EVENT_CONFIG.contact.hostEmail}</p>
      <p style="margin: 5px 0; color: #475569;">This transmission was sent to: ${email}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
MISSION ACCEPTED, AGENT ${firstName.toUpperCase()}

Your clearance has been confirmed.
Assigned Codename: ${codename}

MISSION PARAMETERS:
- Date: December 13, 2025 @ 1900 hours (7:00 PM ${EVENT_CONFIG.timezone})
- Location: ${EVENT_CONFIG.location.name}, ${EVENT_CONFIG.location.address}
- Required Equipment: One wrapped gift ($${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max})

${EVENT_CONFIG.whatsapp.enabled ? `Join the encrypted comms network: ${EVENT_CONFIG.whatsapp.inviteLink}` : ''}

Mission launches in T-minus ${daysUntil} days.

— Santa's Black Ops Division
North Pole Intelligence Command

Questions? ${EVENT_CONFIG.contact.hostEmail}
    `
  };
};

/**
 * PARTY THEME - Confirmation Email
 */
export const partyConfirmationTemplate = (data) => {
  const { name, email } = data;
  const firstName = name.split(' ')[0];
  const daysUntil = getDaysUntil();

  return {
    subject: `You're on the list, ${firstName}! 🎉`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 20px; text-align: center; }
    .content { padding: 30px 20px; color: #e2e8f0; }
    .details-box { background: #334155; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; border-radius: 4px; }
    .whatsapp-btn { display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { background: #1e293b; padding: 20px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 60px; margin-bottom: 10px;">🎄</div>
      <h1 style="margin: 0; color: white; font-size: 36px;">You're In!</h1>
      <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 16px;">
        White Elephant Party 2025
      </p>
    </div>

    <div class="content">
      <p style="font-size: 18px; line-height: 1.6;">
        Hey <strong>${firstName}</strong>! 🎉
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
        You're officially on the guest list for the most chaotic, laughter-filled gift exchange of the year!
      </p>

      <div class="details-box">
        <h2 style="margin: 0 0 15px 0; color: #10b981; font-size: 20px;">📅 Party Details</h2>
        <p style="margin: 10px 0; font-size: 16px;">
          <strong style="color: #fbbf24;">When:</strong> Saturday, December 13, 2025 @ 6:30 PM ${EVENT_CONFIG.timezone}
        </p>
        <p style="margin: 10px 0; font-size: 16px;">
          <strong style="color: #fbbf24;">Where:</strong> ${EVENT_CONFIG.location.name}<br>
          <span style="color: #94a3b8; font-size: 14px;">${EVENT_CONFIG.location.address}, ${EVENT_CONFIG.location.city}</span>
        </p>
        <p style="margin: 10px 0; font-size: 16px;">
          <strong style="color: #fbbf24;">Bring:</strong> One wrapped gift ($${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max})<br>
          <span style="color: #94a3b8; font-size: 14px;">Yes, it has to be wrapped. No, we can't see what it is. That's the whole point! 🎁</span>
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <div style="font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Party Starts In</div>
        <div style="font-size: 36px; color: #ef4444; font-weight: bold; margin: 10px 0;">${daysUntil} days</div>
        <div style="font-size: 14px; color: #cbd5e1;">Mark your calendar! 🗓️</div>
      </div>

      ${EVENT_CONFIG.whatsapp.enabled ? `
      <div style="background: #334155; padding: 25px; margin: 20px 0; text-align: center; border-radius: 8px; border: 2px solid #10b981;">
        <h3 style="margin: 0 0 10px 0; color: #10b981;">💬 Join the Group Chat!</h3>
        <p style="color: #cbd5e1; font-size: 14px; margin: 10px 0;">
          Get updates, share memes, and coordinate rides in our WhatsApp group.
        </p>
        <a href="${EVENT_CONFIG.whatsapp.partyInviteLink}" class="whatsapp-btn">
          📱 Join WhatsApp Group
        </a>
      </div>
      ` : ''}

      <div style="background: #422006; border: 2px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 8px;">
        <div style="color: #fbbf24; font-weight: bold; margin-bottom: 10px;">💡 Pro Tips</div>
        <div style="color: #fde68a; font-size: 14px; line-height: 1.8;">
          • Don't be late! Fashionably late = missing the first round<br>
          • Wrap your gift well (newspaper doesn't count)<br>
          • Bring your competitive spirit AND your sense of humor<br>
          • Expect laughter, chaos, and possibly betrayal
        </div>
      </div>

      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin-top: 30px;">
        We'll send you a reminder closer to the date. Can't wait to see you there!
      </p>

      <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
        — ${EVENT_CONFIG.contact.hostName} 🎅
      </p>
    </div>

    <div class="footer">
      <p style="margin: 5px 0;">Questions? Hit up ${EVENT_CONFIG.contact.hostEmail}</p>
      <p style="margin: 5px 0; color: #475569;">This email was sent to: ${email}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
YOU'RE IN! 🎉

Hey ${firstName}!

You're officially on the guest list for White Elephant Party 2025!

PARTY DETAILS:
- When: Saturday, December 13, 2025 @ 6:30 PM ${EVENT_CONFIG.timezone}
- Where: ${EVENT_CONFIG.location.name}, ${EVENT_CONFIG.location.address}
- Bring: One wrapped gift ($${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max})

${EVENT_CONFIG.whatsapp.enabled ? `Join the WhatsApp group: ${EVENT_CONFIG.whatsapp.partyInviteLink}` : ''}

Party starts in ${daysUntil} days!

— ${EVENT_CONFIG.contact.hostName}
Questions? ${EVENT_CONFIG.contact.hostEmail}
    `
  };
};

/**
 * HEIST THEME - Reminder Email
 */
export const heistReminderTemplate = (data) => {
  const { name, codename } = data;
  const firstName = name.split(' ')[0];
  const daysUntil = getDaysUntil();

  return {
    subject: `Mission Reminder, Agent ${firstName} - T-minus ${daysUntil} days`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #020617; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0f172a; }
    .header { background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%); padding: 25px 20px; text-align: center; border-bottom: 3px solid #dc2626; }
    .content { padding: 30px 20px; color: #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; color: white; font-size: 28px;">⚠️ MISSION REMINDER</h1>
      <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 14px; letter-spacing: 2px;">
        OPERATION SANTA'S MANIFEST
      </p>
    </div>
    <div class="content">
      <p style="font-size: 16px;">Agent <strong style="color: #38bdf8;">${codename}</strong> (${firstName}),</p>
      <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
        Your mission activates in <strong style="color: #fbbf24; font-size: 20px;">T-minus ${daysUntil} days</strong>.
      </p>
      <div style="background: #1e293b; padding: 20px; margin: 20px 0; border-left: 4px solid #0ea5e9; border-radius: 4px;">
        <p style="margin: 5px 0; color: #e2e8f0;"><strong style="color: #38bdf8;">When:</strong> December 13, 2025 @ 1900 hours</p>
        <p style="margin: 5px 0; color: #e2e8f0;"><strong style="color: #38bdf8;">Where:</strong> ${EVENT_CONFIG.location.name}</p>
        <p style="margin: 5px 0; color: #e2e8f0;"><strong style="color: #38bdf8;">Bring:</strong> 🎁 Wrapped decoy package ($${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max})</p>
      </div>
      <p style="color: #cbd5e1; font-size: 14px;">
        <a href="${EVENT_CONFIG.location.mapUrl}" style="color: #38bdf8; text-decoration: none;">📍 Get Directions</a>
      </p>
      <p style="color: #94a3b8; font-size: 13px; margin-top: 30px; font-style: italic;">
        — North Pole Intelligence Command
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
MISSION REMINDER

Agent ${codename} (${firstName}),

Your mission activates in T-minus ${daysUntil} days.

When: December 13, 2025 @ 1900 hours
Where: ${EVENT_CONFIG.location.name}
Bring: Wrapped decoy package ($${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max})

Directions: ${EVENT_CONFIG.location.mapUrl}

— North Pole Intelligence Command
    `
  };
};

/**
 * PARTY THEME - Reminder Email
 */
export const partyReminderTemplate = (data) => {
  const { name } = data;
  const firstName = name.split(' ')[0];
  const daysUntil = getDaysUntil();

  return {
    subject: `Don't forget! White Elephant Party in ${daysUntil} days 🎄`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px 20px; text-align: center; }
    .content { padding: 30px 20px; color: #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 50px;">⏰</div>
      <h1 style="margin: 10px 0 0 0; color: white; font-size: 28px;">Party Reminder!</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px;">Hey ${firstName}! 👋</p>
      <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
        Just a friendly reminder that the White Elephant Party is in <strong style="color: #ef4444; font-size: 20px;">${daysUntil} days</strong>!
      </p>
      <div style="background: #334155; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; border-radius: 4px;">
        <p style="margin: 5px 0; color: #e2e8f0;"><strong style="color: #10b981;">When:</strong> Saturday, Dec 13 @ 6:30 PM</p>
        <p style="margin: 5px 0; color: #e2e8f0;"><strong style="color: #10b981;">Where:</strong> ${EVENT_CONFIG.location.name}</p>
        <p style="margin: 5px 0; color: #e2e8f0;"><strong style="color: #10b981;">Bring:</strong> 🎁 One wrapped gift ($${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max})</p>
      </div>
      <p style="color: #cbd5e1; font-size: 14px;">
        Don't forget to grab your gift! And remember: it has to be wrapped. 🎁
      </p>
      <p style="color: #cbd5e1; font-size: 14px;">
        <a href="${EVENT_CONFIG.location.mapUrl}" style="color: #10b981; text-decoration: none;">📍 Get Directions</a>
      </p>
      <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
        See you soon!<br>— ${EVENT_CONFIG.contact.hostName}
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
PARTY REMINDER! ⏰

Hey ${firstName}!

The White Elephant Party is in ${daysUntil} days!

When: Saturday, Dec 13 @ 6:30 PM
Where: ${EVENT_CONFIG.location.name}
Bring: One wrapped gift ($${EVENT_CONFIG.giftBudget.min}-$${EVENT_CONFIG.giftBudget.max})

Directions: ${EVENT_CONFIG.location.mapUrl}

See you soon!
— ${EVENT_CONFIG.contact.hostName}
    `
  };
};

export default {
  heistConfirmation: heistConfirmationTemplate,
  partyConfirmation: partyConfirmationTemplate,
  heistReminder: heistReminderTemplate,
  partyReminder: partyReminderTemplate
};
