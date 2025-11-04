/**
 * Codename Registry
 * Tracks all assigned codenames to ensure uniqueness
 */

const STORAGE_KEY = 'heist_codename_registry';

/**
 * Get all registered codenames
 * @returns {Array<{codename: string, timestamp: number}>}
 */
export const getRegisteredCodenames = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get codename registry:', error);
    return [];
  }
};

/**
 * Check if a codename is already taken
 * @param {string} codename - The codename to check
 * @returns {boolean}
 */
export const isCodenameTaken = (codename) => {
  const registry = getRegisteredCodenames();
  const normalizedCheck = codename.toLowerCase().trim();
  return registry.some(entry => 
    entry.codename.toLowerCase().trim() === normalizedCheck
  );
};

/**
 * Register a new codename
 * @param {string} codename - The codename to register
 * @returns {boolean} - True if successfully registered, false if already taken
 */
export const registerCodename = (codename) => {
  if (isCodenameTaken(codename)) {
    return false;
  }

  try {
    const registry = getRegisteredCodenames();
    registry.push({
      codename: codename.trim(),
      timestamp: Date.now()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
    return true;
  } catch (error) {
    console.error('Failed to register codename:', error);
    return false;
  }
};

/**
 * Remove a codename from registry (admin function)
 * @param {string} codename - The codename to remove
 */
export const unregisterCodename = (codename) => {
  try {
    const registry = getRegisteredCodenames();
    const normalizedRemove = codename.toLowerCase().trim();
    const filtered = registry.filter(entry => 
      entry.codename.toLowerCase().trim() !== normalizedRemove
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to unregister codename:', error);
    return false;
  }
};

/**
 * Clear all registered codenames (admin function - use with caution!)
 */
export const clearCodenameRegistry = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear codename registry:', error);
    return false;
  }
};

/**
 * Get total number of registered codenames
 * @returns {number}
 */
export const getCodenameCount = () => {
  return getRegisteredCodenames().length;
};

/**
 * Export registry for admin view
 * @returns {Array<{codename: string, timestamp: number, date: string}>}
 */
export const exportCodenameRegistry = () => {
  const registry = getRegisteredCodenames();
  return registry.map(entry => ({
    ...entry,
    date: new Date(entry.timestamp).toLocaleString()
  }));
};
