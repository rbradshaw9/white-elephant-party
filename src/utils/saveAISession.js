import { supabase } from './supabaseClient';

/**
 * Save AI chat session to Supabase
 * @param {string} agentId - Agent's UUID
 * @param {Array} messages - Array of chat messages
 * @param {number} rating - Optional rating (1-5)
 * @returns {Object} Created session record
 */
export async function saveAISession(agentId, messages, rating = null) {
  try {
    // Note: Don't pass created_at explicitly - let DB default handle it
    const { data, error } = await supabase
      .from('ai_sessions')
      .insert([
        {
          agent_id: agentId,
          messages: messages,
          rating: rating,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Failed to save AI session:', error);
      throw error;
    }

    console.log('✅ AI session saved');
    return data;
  } catch (error) {
    console.error('AI session save error:', error);
    throw error;
  }
}

/**
 * Update existing AI session
 * @param {string} sessionId - Session UUID
 * @param {Array} messages - Updated messages array
 * @returns {Object} Updated session record
 */
export async function updateAISession(sessionId, messages) {
  try {
    const { data, error } = await supabase
      .from('ai_sessions')
      .update({
          messages: messages,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to update AI session:', error);
    throw error;
  }
}

/**
 * Get latest AI session for an agent
 * @param {string} agentId - Agent's UUID
 * @returns {Object} Latest session or null
 */
export async function getLatestAISession(agentId) {
  try {
    const { data, error } = await supabase
      .from('ai_sessions')
      .select('*')
      .eq('agent_id', agentId)
      // Order by created_at (schema uses created_at)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No sessions found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get AI session:', error);
    return null;
  }
}

/**
 * Get all HQ transmissions (global messages)
 * @param {boolean} activeOnly - Only return active transmissions
 * @returns {Array} List of transmissions
 */
export async function getTransmissions(activeOnly = true) {
  try {
    let query = supabase.from('transmissions').select('*');

    if (activeOnly) {
      // Schema column is `is_active`
      query = query.eq('is_active', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to get transmissions:', error);
    return [];
  }
}

/**
 * Create a new transmission
 * @param {Object} transmission - Transmission data
 * @returns {Object} Created transmission
 */
export async function createTransmission(transmission) {
  try {
    const { data, error } = await supabase
      .from('transmissions')
      .insert([transmission])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to create transmission:', error);
    throw error;
  }
}
