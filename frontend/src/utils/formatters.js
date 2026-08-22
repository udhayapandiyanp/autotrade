/**
 * Formats a numeric price into Indian Rupees (INR) format with the ₹ symbol.
 * e.g., 250000 -> ₹2,50,000
 *
 * @param {number|string} price - The price value to format
 * @returns {string} Formatted price string with rupee symbol
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return '₹0';
  }
  return `₹${Number(price).toLocaleString('en-IN')}`;
};
