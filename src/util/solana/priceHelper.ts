export const INITIAL_PRICE = 1_000_000.0; // Initial price of the token in SOL
export const PRICE_SLOPE = 33_000_000_000.0; // Price increase per token sold in SOL
export const DECIMAL = 1_000.0; // Decimal precision
export const SCALE = 1_000_000_000.0; // Scale for division and multiplication

// Function to calculate the price of tokens based on the current token supply
export function calculateTokenPrice(currentSupply: number) {
  // Convert INITIAL_PRICE to f64 before multiplication to avoid overflow
  const initialPrice = INITIAL_PRICE;
  // Multiply by SCALE before division to maintain precision
  const priceSlopeScaled = (currentSupply * PRICE_SLOPE) / SCALE;
  return initialPrice * SCALE + priceSlopeScaled;
}

// Function to calculate SOL needed to buy x amount of tokens
export function calculateSolNeeded(
  currentSupply: number,
  desiredTokenAmount: number,
  decimal: number
) {
  const tokenPrice = calculateTokenPrice(currentSupply);
  // Multiply by SCALE before division to maintain precision
  return Math.ceil(((desiredTokenAmount * tokenPrice) / SCALE) * 10 ** decimal);
}

// Function to calculate tokens bought with x amount of SOL
export function calculateTokensBought(
  currentSupply: number,
  solSent: number,
  decimal: number
) {
  const tokenPrice = calculateTokenPrice(currentSupply);
  // Multiply by SCALE before division to maintain precision
  return Math.ceil(((solSent * SCALE) / tokenPrice) * 10 ** decimal);
}
