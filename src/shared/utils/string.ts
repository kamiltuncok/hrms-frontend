/**
 * Normalizes Turkish characters to their English counterparts for searching.
 */
export const normalizeTurkish = (text: string | null | undefined): string => {
  if (!text) return '';
  const map: { [key: string]: string } = {
    'İ': 'i', 'I': 'i', 'ı': 'i', 'i': 'i',
    'Ğ': 'g', 'ğ': 'g',
    'Ü': 'u', 'ü': 'u',
    'Ş': 's', 'ş': 's',
    'Ö': 'o', 'ö': 'o',
    'Ç': 'c', 'ç': 'c'
  };
  return text
    .split('')
    .map(c => map[c] || c)
    .join('')
    .toLowerCase();
};

/**
 * Performs a Turkish case-insensitive search.
 */
export const turkishCaseInsensitiveSearch = (text: string | null | undefined, searchTerm: string | null | undefined): boolean => {
  if (!text || !searchTerm) return false;
  return normalizeTurkish(text).includes(normalizeTurkish(searchTerm));
};

/**
 * Performs a Turkish case-insensitive match.
 */
export const turkishCaseInsensitiveMatch = (text1: string | null | undefined, text2: string | null | undefined): boolean => {
  if (!text1 || !text2) return false;
  return normalizeTurkish(text1) === normalizeTurkish(text2);
};
