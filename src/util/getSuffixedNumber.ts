const SUFFIXES = "KMBTqQsSOND";

export function getSuffixedNumber(num: number): string {
  if (num === 0) {
    return "0";
  }
  const power = Math.floor(Math.log10(num));
  const index = Math.floor(power / 3);
  num = Math.round(num / Math.pow(10, index * 3)); // first 3 digits of the number
  return num + (SUFFIXES[index - 1] || ""); // default to no suffix if we get an out of bounds index
}
