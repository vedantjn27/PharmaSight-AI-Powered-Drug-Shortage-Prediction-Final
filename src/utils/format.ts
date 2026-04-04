/**
 * Formats a number to standard Indian Rupees notation (₹)
 */
export const formatCurrency = (n: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(n);
};

/**
 * Formats standard numbers with commas (e.g. 10,00,000)
 */
export const formatNumber = (n: number): string => {
  return n.toLocaleString('en-IN');
};

/**
 * Rounds a number to specific decimal places
 */
export const roundTo = (n: number, dp: number): number => {
  const multiplier = Math.pow(10, dp);
  return Math.round(n * multiplier) / multiplier;
};

/**
 * Formats date "YYYY-MM-DD" into "12 Apr 2025"
 */
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate().toString().padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};
