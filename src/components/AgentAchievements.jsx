import { motion } from 'framer-motion';

/**
 * Agent Achievements Component
 * Awards fun badges based on agent stats
 */
const AgentAchievements = ({ agent, allAgents = [] }) => {
  const achievements = [];

  // Calculate achievements
  if (allAgents.length > 0) {
    // First Agent
    const oldestAgent = allAgents.reduce((oldest, current) => {
      return new Date(current.created_at) < new Date(oldest.created_at) ? current : oldest;
    });
    if (agent.id === oldestAgent.id) {
      achievements.push({
        icon: '🥇',
        title: 'First Recruit',
        description: 'First agent to join the operation',
        color: 'text-amber-400 border-amber-500/50 bg-amber-500/10'
      });
    }

    // Biggest Squad
    const maxGuests = Math.max(...allAgents.map(a => a.guest_count || 0));
    if (agent.guest_count === maxGuests && maxGuests > 0) {
      achievements.push({
        icon: '👥',
        title: 'Squad Leader',
        description: `Bringing the most guests (${agent.guest_count})`,
        color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10'
      });
    }

    // Early Bird (joined in first 25% of agents)
    const agentIndex = allAgents
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .findIndex(a => a.id === agent.id);
    
    if (agentIndex < allAgents.length * 0.25 && allAgents.length > 4) {
      achievements.push({
        icon: '⚡',
        title: 'Early Bird',
        description: 'Among the first 25% to join',
        color: 'text-sky-400 border-sky-500/50 bg-sky-500/10'
      });
    }

    // Lone Wolf (solo mission)
    if (agent.guest_count === 0) {
      achievements.push({
        icon: '🐺',
        title: 'Lone Wolf',
        description: 'Flying solo on this mission',
        color: 'text-purple-400 border-purple-500/50 bg-purple-500/10'
      });
    }

    // Party Starter (if recruiting others)
    if (agent.guest_count >= 3) {
      achievements.push({
        icon: '🎉',
        title: 'Party Starter',
        description: 'Bringing the whole crew!',
        color: 'text-pink-400 border-pink-500/50 bg-pink-500/10'
      });
    }
  }

  // Codename length achievements
  if (agent.codename) {
    const codenameLength = agent.codename.length;
    
    if (codenameLength > 20) {
      achievements.push({
        icon: '📜',
        title: 'Verbose Operative',
        description: 'Longest codename on record',
        color: 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10'
      });
    }
  }

  // Personality responses (if lots of conversation)
  if (agent.personality_responses && agent.personality_responses.length >= 5) {
    achievements.push({
      icon: '💬',
      title: 'Chatty Agent',
      description: 'Had a deep conversation with HQ',
      color: 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10'
    });
  }

  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-slate-400 text-sm font-mono mb-3 flex items-center gap-2">
        <span>🏆</span>
        ACHIEVEMENTS UNLOCKED
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            className={`border rounded-lg p-3 ${achievement.color}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-2">
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-sm">{achievement.title}</div>
                <div className="text-xs opacity-80 mt-1">{achievement.description}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AgentAchievements;
