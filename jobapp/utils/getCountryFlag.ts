import { countryCodeMap } from '../data/country-codes';

const getCountryName = (location: string): string | null => {
  if (!location || typeof location !== 'string') return null;
  const parts = location.split(',').map(part => part.trim());
  // Return the last part if there's a comma, otherwise null
  return parts.length > 1 ? parts[parts.length - 1] : null;
};

// Converts a two-letter country code to a flag emoji
const codeToFlag = (code: string): string => {
    const codePoints = code
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export const getCountryFlag = (location: string): string | null => {
  const countryName = getCountryName(location);
  if (!countryName) return null;

  const countryCode = countryCodeMap[countryName];
  if (!countryCode) return null;

  return codeToFlag(countryCode);
};
