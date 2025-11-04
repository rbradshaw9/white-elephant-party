import { getAgentByCodename, getAgentById } from './saveAgentData';

/**
 * Check if user is a returning agent
 * Looks in localStorage for previous session
 * @returns {Object|null} Agent data if found, null otherwise
 */
export async function checkReturningAgent() {
  try {
    // Check localStorage for stored credentials
    const storedCodename = localStorage.getItem('agent_codename');
    const storedAgentId = localStorage.getItem('agent_id');

    if (!storedCodename && !storedAgentId) {
      console.log('No returning agent data found');
      return null;
    }

    // Try to fetch agent by codename first (more reliable)
    if (storedCodename) {
      const agent = await getAgentByCodename(storedCodename);
      if (agent) {
        console.log('✅ Returning agent detected:', agent.codename);
        return agent;
      }
    }

    // Fallback to agent ID
    if (storedAgentId) {
      const agent = await getAgentById(storedAgentId);
      if (agent) {
        console.log('✅ Returning agent detected by ID:', agent.codename);
        // Update localStorage with current codename
        localStorage.setItem('agent_codename', agent.codename);
        return agent;
      }
    }

    // Agent data exists in localStorage but not in database
    console.warn('⚠️ Agent credentials found locally but not in database. Clearing...');
    clearAgentSession();
    return null;

  } catch (error) {
    console.error('Error checking for returning agent:', error);
    return null;
  }
}

/**
 * Store agent session in localStorage
 * @param {Object} agent - Agent data from Supabase
 */
export function storeAgentSession(agent) {
  localStorage.setItem('agent_codename', agent.codename);
  localStorage.setItem('agent_id', agent.id);
  localStorage.setItem('agent_name', agent.real_name);
  localStorage.setItem('session_timestamp', new Date().toISOString());
  console.log('✅ Agent session stored locally');
}

/**
 * Clear agent session from localStorage
 */
export function clearAgentSession() {
  localStorage.removeItem('agent_codename');
  localStorage.removeItem('agent_id');
  localStorage.removeItem('agent_name');
  localStorage.removeItem('session_timestamp');
  console.log('🗑️ Agent session cleared');
}

/**
 * Get stored agent info without database lookup
 * @returns {Object|null} Stored agent info or null
 */
export function getStoredAgentInfo() {
  const codename = localStorage.getItem('agent_codename');
  const agentId = localStorage.getItem('agent_id');
  const name = localStorage.getItem('agent_name');
  const timestamp = localStorage.getItem('session_timestamp');

  if (!codename || !agentId) {
    return null;
  }

  return {
    codename,
    agentId,
    name,
    timestamp,
  };
}

/**
 * Check if agent session is still valid (within 30 days)
 * @returns {boolean} True if session is valid
 */
export function isSessionValid() {
  const timestamp = localStorage.getItem('session_timestamp');
  if (!timestamp) return false;

  const sessionDate = new Date(timestamp);
  const now = new Date();
  const daysSinceSession = (now - sessionDate) / (1000 * 60 * 60 * 24);

  return daysSinceSession < 30; // Valid for 30 days
}
