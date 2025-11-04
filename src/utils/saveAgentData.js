import { supabase } from './supabaseClient';

/**
 * Save or update agent data in Supabase
 * @param {Object} agentData - Agent information
 * @returns {Object} Created/updated agent record
 */
export async function saveAgent(agentData) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .upsert([agentData], { onConflict: 'codename' })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('✅ Agent saved:', data);
    return data;
  } catch (error) {
    console.error('Failed to save agent:', error);
    throw error;
  }
}

/**
 * Get agent by codename
 * @param {string} codename - Agent's codename
 * @returns {Object} Agent record or null
 */
export async function getAgentByCodename(codename) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('codename', codename)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get agent:', error);
    return null;
  }
}

/**
 * Get agent by ID
 * @param {string} agentId - Agent's UUID
 * @returns {Object} Agent record or null
 */
export async function getAgentById(agentId) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to get agent by ID:', error);
    return null;
  }
}

/**
 * Update agent conversation log
 * @param {string} agentId - Agent's UUID
 * @param {Array} conversationLog - Array of message objects
 * @returns {Object} Updated agent record
 */
export async function updateConversationLog(agentId, conversationLog) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .update({ conversation_log: conversationLog })
      .eq('id', agentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to update conversation log:', error);
    throw error;
  }
}

/**
 * Get all attending agents for roster
 * @returns {Array} List of attending agents
 */
export async function getAttendingAgents() {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('real_name, codename, guest_count, guest_names')
      .eq('attendance_status', 'attending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to get attending agents:', error);
    return [];
  }
}

/**
 * Get all agents (admin view)
 * @returns {Array} List of all agents
 */
export async function getAllAgents() {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to get all agents:', error);
    return [];
  }
}
