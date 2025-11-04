/**
 * Agent Codename Generator
 * Generates fun elf-themed codenames for heist theme
 */

import greatGiftHeistTheme from '../themes/greatGiftHeistTheme';

/**
 * Generate a random agent codename
 * @returns {string} - A randomly generated codename (e.g., "Jolly Boots")
 */
export const generateCodename = () => {
  const { adjectives, nouns } = greatGiftHeistTheme.codenames;
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective} ${randomNoun}`;
};

/**
 * Generate multiple unique codenames
 * @param {number} count - Number of codenames to generate
 * @returns {string[]} - Array of unique codenames
 */
export const generateMultipleCodenames = (count = 5) => {
  const codenames = new Set();
  const { adjectives, nouns } = greatGiftHeistTheme.codenames;
  
  while (codenames.size < count) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    codenames.add(`${adjective} ${noun}`);
  }
  
  return Array.from(codenames);
};

/**
 * Get total number of possible codename combinations
 * @returns {number} - Total possible unique codenames
 */
export const getTotalCombinations = () => {
  const { adjectives, nouns } = greatGiftHeistTheme.codenames;
  return adjectives.length * nouns.length;
};

export default generateCodename;
