/**
 * Converts a camelCase string to a readable format
 * Example: "helloWorld" -> "Hello World"
 */
export function camelCaseToReadable(camelCase: string): string {
  // Add space before capital letters and capitalize first letter
  return camelCase
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
}

/**
 * Converts a readable string to camelCase
 * Example: "Hello World" -> "helloWorld"
 */
export function readableToCamelCase(readable: string): string {
  return readable
    .toLowerCase()
    .replace(/\s+(.)/g, (match, group) => group.toUpperCase());
} 