import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAgentByCodename } from '../utils/saveAgentData';
import Snowfall from '../components/Snowfall';
import EVENT_CONFIG from '../config/config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Agent Card Page
 * Displays a digital agent credential card with mission details
 */
const AgentCard = () => {
  const { codename } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    loadAgentData();
  }, [codename]);

  const loadAgentData = async () => {
    try {
      setLoading(true);
      const agentData = await getAgentByCodename(codename);
      
      if (!agentData) {
        setError('Agent not found in database');
      } else {
        setAgent(agentData);
      }
    } catch (err) {
      console.error('Failed to load agent:', err);
      setError('Failed to load agent data');
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Agent-${codename}-Credentials.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to download card. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <Snowfall color="#4ade80" />
        <div className="relative min-h-screen flex items-center justify-center p-6 z-10">
          <div className="text-green-400 font-mono text-xl">
            Loading agent credentials...
          </div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="relative min-h-screen">
        <Snowfall color="#4ade80" />
        <div className="relative min-h-screen flex items-center justify-center p-6 z-10">
          <motion.div
            className="glass-card rounded-3xl p-12 text-center max-w-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold text-red-400 mb-4">Agent Not Found</h1>
            <p className="text-slate-400 mb-6">
              No agent with codename "{codename}" exists in our database.
            </p>
            <Link to="/">
              <button className="btn-festive text-lg">
                ← Return to HQ
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const statusColors = {
    attending: 'text-emerald-400 bg-emerald-500/20 border-emerald-500',
    not_attending: 'text-red-400 bg-red-500/20 border-red-500',
    uncertain: 'text-yellow-400 bg-yellow-500/20 border-yellow-500',
  };

  const statusLabels = {
    attending: 'MISSION ACCEPTED',
    not_attending: 'MISSION DECLINED',
    uncertain: 'PENDING CONFIRMATION',
  };

  return (
    <div className="relative min-h-screen">
      <Snowfall color="#4ade80" />
      
      <div className="relative min-h-screen p-6 py-20 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl mb-4 font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400">
              🎖️ Agent Credentials
            </h1>
            <p className="text-slate-400 font-mono">CLASSIFIED - FOR AUTHORIZED PERSONNEL ONLY</p>
          </motion.div>

          {/* Agent Card */}
          <motion.div
            ref={cardRef}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-sky-500/30 shadow-2xl shadow-sky-500/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Classification Banner */}
            <div className="bg-sky-500/20 border-l-4 border-sky-500 px-4 py-2 mb-6 font-mono text-xs text-sky-400">
              CLASSIFIED: NORTH POLE INTELLIGENCE DIVISION
            </div>

            {/* Agent Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <div className="text-slate-500 text-xs font-mono mb-1">AGENT CODENAME</div>
                  <div className="text-3xl font-display font-bold text-sky-400 tracking-wide">
                    {agent.codename}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-xs font-mono mb-1">REAL NAME</div>
                  <div className="text-xl text-white">{agent.real_name}</div>
                </div>

                <div>
                  <div className="text-slate-500 text-xs font-mono mb-1">CLEARANCE ISSUED</div>
                  <div className="text-sm text-slate-300 font-mono">
                    {new Date(agent.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-xs font-mono mb-1">ACCESS CODE</div>
                  <div className="text-sm text-slate-400 font-mono">{agent.access_code || 'REDACTED'}</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <div className="text-slate-500 text-xs font-mono mb-1">MISSION STATUS</div>
                  <div className={`inline-block px-4 py-2 rounded-lg border-2 font-mono text-sm font-bold ${statusColors[agent.attendance_status]}`}>
                    {statusLabels[agent.attendance_status]}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-xs font-mono mb-1">TEAM SIZE</div>
                  <div className="text-xl text-white">
                    {agent.guest_count + 1} {agent.guest_count + 1 === 1 ? 'Operative' : 'Operatives'}
                  </div>
                </div>

                {agent.guest_names && agent.guest_names.length > 0 && (
                  <div>
                    <div className="text-slate-500 text-xs font-mono mb-1">ADDITIONAL OPERATIVES</div>
                    <div className="text-sm text-slate-300 space-y-1">
                      {agent.guest_names.map((name, i) => (
                        <div key={i}>• {name}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mission Details */}
            {agent.attendance_status === 'attending' && (
              <div className="border-t-2 border-slate-700 pt-6 mt-6">
                <div className="text-slate-500 text-xs font-mono mb-4">MISSION BRIEFING</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 rounded-lg p-6">
                  <div>
                    <div className="text-sky-400 font-mono text-xs mb-1">OPERATION NAME</div>
                    <div className="text-white font-semibold">{EVENT_CONFIG.heistName}</div>
                  </div>

                  <div>
                    <div className="text-sky-400 font-mono text-xs mb-1">MISSION DATE</div>
                    <div className="text-white font-mono">December 13, 2025 @ 1900 HRS</div>
                  </div>

                  <div>
                    <div className="text-sky-400 font-mono text-xs mb-1">LOCATION</div>
                    <div className="text-white">{EVENT_CONFIG.location.name}</div>
                  </div>

                  <div>
                    <div className="text-sky-400 font-mono text-xs mb-1">BUDGET</div>
                    <div className="text-white font-mono">
                      ${EVENT_CONFIG.giftBudget.min}-${EVENT_CONFIG.giftBudget.max}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="text-sky-400 font-mono text-xs mb-1">MAP COORDINATES</div>
                    <a
                      href={EVENT_CONFIG.location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline text-sm"
                    >
                      {EVENT_CONFIG.location.mapUrl}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-6 border-t-2 border-slate-700 flex items-center justify-between">
              <div className="text-slate-500 text-xs font-mono">
                ID: {agent.id.substring(0, 8)}...
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-xs font-mono">ACTIVE</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={downloadCard}
              className="btn-festive-green text-lg px-8"
            >
              📥 Download Card
            </button>
            
            <Link to="/roster">
              <button className="btn-festive text-lg px-8 w-full sm:w-auto">
                👥 View All Agents
              </button>
            </Link>

            <Link to="/">
              <button className="bg-slate-800/50 text-slate-300 px-8 py-3 rounded-xl hover:bg-slate-700/50 transition-all text-lg w-full sm:w-auto">
                ← Return to HQ
              </button>
            </Link>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            className="text-center mt-12 text-slate-600 text-xs font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div>⚠️ CLASSIFIED MATERIAL - UNAUTHORIZED ACCESS PROHIBITED ⚠️</div>
            <div className="mt-1">NORTH POLE INTELLIGENCE DIVISION • OPERATION SANTA'S MANIFEST</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
