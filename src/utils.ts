/**
 * Formats a given number into Jordanian Dinar (د.أ or JOD) currency format.
 */
export function formatCurrency(amount: number, locale: 'ar' | 'en' = 'ar'): string {
  if (locale === 'ar') {
    return `${amount.toFixed(2)} د.أ`;
  }
  return `${amount.toFixed(2)} JOD`;
}

/**
 * Generates a unique, professional invoice number sequence.
 * Format: REST-YYYYMMDD-XXXX
 */
export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}${day}-${random}`;
}
