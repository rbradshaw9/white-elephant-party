import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HQTerminal from '../components/HQTerminal';
import { useTheme } from '../context/ThemeContext';
import Snowfall from '../components/Snowfall';

/**
 * HQ Page - Access to North Pole Command Terminal
 * Allows users to:
 * - Open the terminal for registration
 * - Return to their agent card if already registered
 * - Access party information
 */
const HQ = () => {
  const navigate = useNavigate();
  const { theme, isHeistTheme } = useTheme();
  const [showTerminal, setShowTerminal] = useState(false);
  const [agentCodename, setAgentCodename] = useState(null);

  useEffect(() => {
    // Check if user is already registered
    const savedCodename = sessionStorage.getItem('agentCodename');
    setAgentCodename(savedCodename);
  }, []);

  const handleOpenTerminal = () => {
    setShowTerminal(true);
  };

  const handleTerminalComplete = (agent) => {
    // Store codename and navigate to agent card
    sessionStorage.setItem('agentCodename', agent.codename);
    setAgentCodename(agent.codename);
    setShowTerminal(false);
  };

  const handleViewCard = () => {
    if (agentCodename) {
      navigate(`/agent/${agentCodename}`);
    }
  };

  if (showTerminal) {
    return <HQTerminal onComplete={handleTerminalComplete} />;
  }

  return (
    <div className="relative min-h-screen">
      <Snowfall color={theme.effects.particleColor} />
      
      <div className="relative z-10 min-h-screen p-6 py-20 flex items-center justify-center">
        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {isHeistTheme ? '📡' : '🎅'}
            </motion.div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${theme.palette.gradients.hero}`}>
              {isHeistTheme ? 'HQ Terminal' : 'North Pole Command'}
            </h1>
            <p className="text-xl" style={{ color: theme.palette.text.secondary }}>
              {isHeistTheme 
                ? 'Access the secure agent network' 
                : 'Connect to the elf agent network'}
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-3xl p-8 space-y-6">
            {agentCodename ? (
              // Returning agent
              <>
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{agentCodename}</span>!
                  </div>
                  <p style={{ color: theme.palette.text.secondary }}>
                    Your {isHeistTheme ? 'agent' : 'elf'} profile is active.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleViewCard}
                    className="w-full btn-festive text-lg py-4"
                  >
                    🎁 View My {isHeistTheme ? 'Agent' : 'Elf'} Card
                  </button>
                  
                  <button
                    onClick={handleOpenTerminal}
                    className="w-full glass-button text-lg py-4"
                    style={{ 
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.accent + '40'
                    }}
                  >
                    📡 Open Terminal
                  </button>
                </div>

                <div className="text-center text-sm" style={{ color: theme.palette.text.muted }}>
                  <p>Need to update your RSVP or party info?</p>
                  <p>Use the terminal to make changes.</p>
                </div>
              </>
            ) : (
              // New visitor
              <>
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold" style={{ color: theme.palette.text.primary }}>
                    {isHeistTheme ? '🎯 Join the Mission' : '🎄 Join the Workshop'}
                  </div>
                  <p style={{ color: theme.palette.text.secondary }}>
                    {isHeistTheme 
                      ? 'Register as an agent and get your codename'
                      : 'Register as an elf and get your festive codename'}
                  </p>
                </div>

                <button
                  onClick={handleOpenTerminal}
                  className="w-full btn-festive text-lg py-4"
                >
                  {isHeistTheme ? '📡 Access Terminal' : '🎅 Enter North Pole Terminal'}
                </button>

                <div className="space-y-3 p-6 rounded-2xl" style={{ 
                  backgroundColor: theme.palette.accent + '10',
                  borderLeft: `4px solid ${theme.palette.accent}`
                }}>
                  <div className="font-bold" style={{ color: theme.palette.text.primary }}>
                    What you'll do:
                  </div>
                  <ul className="space-y-2 text-sm" style={{ color: theme.palette.text.secondary }}>
                    <li>✨ Get assigned a unique {isHeistTheme ? 'agent' : 'elf'} codename</li>
                    <li>🎁 RSVP for the party</li>
                    <li>📋 Share your gift preferences</li>
                    <li>🎉 Join the {isHeistTheme ? 'roster' : 'workshop team'}</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8 space-y-2" style={{ color: theme.palette.text.muted }}>
            <p className="text-sm">
              🎄 Operation Santa's Manifest • December 13, 2025
            </p>
            <p className="text-xs font-mono">
              {isHeistTheme ? 'CLASSIFIED NETWORK • SECURE CONNECTION' : 'WORKSHOP NETWORK • CANDY CANE ENCRYPTION'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HQ;
