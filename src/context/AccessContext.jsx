import { createContext, useContext, useState, useEffect } from 'react';
import EVENT_CONFIG from '../config/config';

const AccessContext = createContext();

export const useAccess = () => {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error('useAccess must be used within AccessProvider');
  }
  return context;
};

export const AccessProvider = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing access on mount
  useEffect(() => {
    const checkAccess = () => {
      console.log('🔒 ACCESS CHECK:', {
        enabled: EVENT_CONFIG.accessGate.enabled,
        requireCode: EVENT_CONFIG.accessGate.requireCode,
        sessionKey: EVENT_CONFIG.accessGate.sessionKey
      });

      // If access gate is disabled, grant access immediately
      if (!EVENT_CONFIG.accessGate.enabled || !EVENT_CONFIG.accessGate.requireCode) {
        console.log('⚠️ Access gate disabled - granting access');
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Check session storage for access
      const accessGranted = sessionStorage.getItem(EVENT_CONFIG.accessGate.sessionKey);
      const vipStatus = sessionStorage.getItem('heist_vip_status');
      const storedName = sessionStorage.getItem('heist_agent_name');

      console.log('🔍 Session Storage:', {
        accessGranted,
        vipStatus,
        storedName
      });

      if (accessGranted === 'true') {
        console.log('✅ Found existing access in session');
        setHasAccess(true);
        setIsVIP(vipStatus === 'true');
        setAgentName(storedName || '');
      } else {
        console.log('❌ No access found - user needs to authenticate');
      }
      
      setIsLoading(false);
    };

    checkAccess();
  }, []);

  const validateCode = (code) => {
    const upperCode = code.toUpperCase().trim();

    // Check universal code
    if (upperCode === EVENT_CONFIG.accessGate.universalCode) {
      grantAccess(false, 'Agent');
      return { valid: true, vip: false, name: 'Agent' };
    }

    // Check VIP codes
    if (EVENT_CONFIG.accessGate.vipCodes.includes(upperCode)) {
      grantAccess(true, 'VIP Agent');
      return { valid: true, vip: true, name: 'VIP Agent' };
    }

    // Check individual agent codes
    const agentCode = EVENT_CONFIG.accessGate.agentCodes.find(
      (ac) => ac.code === upperCode && !ac.used
    );

    if (agentCode) {
      // Mark code as used (in a real app, this would update the database)
      agentCode.used = true;
      grantAccess(false, agentCode.name);
      return { valid: true, vip: false, name: agentCode.name };
    }

    // Code not found
    return { valid: false, vip: false, name: '' };
  };

  const grantAccess = (vip = false, name = '') => {
    setHasAccess(true);
    setIsVIP(vip);
    setAgentName(name);
    
    // Store in session storage
    sessionStorage.setItem(EVENT_CONFIG.accessGate.sessionKey, 'true');
    sessionStorage.setItem('heist_vip_status', vip ? 'true' : 'false');
    sessionStorage.setItem('heist_agent_name', name);
  };

  const revokeAccess = () => {
    setHasAccess(false);
    setIsVIP(false);
    setAgentName('');
    sessionStorage.removeItem(EVENT_CONFIG.accessGate.sessionKey);
    sessionStorage.removeItem('heist_vip_status');
    sessionStorage.removeItem('heist_agent_name');
  };

  const value = {
    hasAccess,
    isVIP,
    agentName,
    isLoading,
    validateCode,
    grantAccess,
    revokeAccess,
  };

  return (
    <AccessContext.Provider value={value}>
      {children}
    </AccessContext.Provider>
  );
};

export default AccessContext;
