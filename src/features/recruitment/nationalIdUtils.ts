/**
 * Utility functions for Egyptian National ID parsing and education validation
 */

/**
 * List of qualifications that represent Higher / Post-Secondary Education
 * For these degrees, Specialization / Faculty and University / Institute are mandatory.
 */
export const HIGHER_EDUCATION_QUALIFICATIONS = [
  'دكتوراه',
  'ماجستير',
  'بكالوريوس',
  'ليسانس',
  'معهد فني فوق متوسط',
];

/**
 * Determines if a given qualification is higher education (requiring university and major)
 */
export function isHigherEducation(qualification?: string | null): boolean {
  if (!qualification) return false;
  const trimmed = qualification.trim();
  return HIGHER_EDUCATION_QUALIFICATIONS.some(
    (q) => q.toLowerCase() === trimmed.toLowerCase() || trimmed.includes(q)
  );
}

/**
 * Extracts and formats birth date (YYYY-MM-DD) from a 14-digit Egyptian National ID
 */
export function extractBirthDateFromNationalId(nid?: string | null): string | null {
  if (!nid) return null;
  const cleaned = nid.trim();
  if (!/^\d{14}$/.test(cleaned)) return null;

  const centuryDigit = cleaned[0];
  const yearDigits = cleaned.substring(1, 3);
  const monthDigits = cleaned.substring(3, 5);
  const dayDigits = cleaned.substring(5, 7);

  let century = '';
  if (centuryDigit === '2') {
    century = '19';
  } else if (centuryDigit === '3') {
    century = '20';
  } else {
    return null;
  }

  const year = parseInt(`${century}${yearDigits}`, 10);
  const month = parseInt(monthDigits, 10);
  const day = parseInt(dayDigits, 10);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return null;
  }

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}
