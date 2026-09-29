/**
 * Currency utilities for Brand Bazaar (Indian Rupees INR)
 */
export function formatRupees(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatRupeesWithDecimals(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0.00';
  }
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';
