// utils/debounce.ts
import debounce from "lodash.debounce";

// Define the type for the function to be debounced
type AnyFunction = (...args: any[]) => any;

// Define the type for the debounce function
export const debounceFunction = <T extends AnyFunction>(
  func: T,
  delay: number
): T => {
  return debounce(func, delay) as unknown as T;
};
