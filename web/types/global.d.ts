export {};

declare global {
  interface Window {
    /** Microsoft UET queue — an array until bat.js loads, then the UET instance (also has `push`). */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uetq?: any[];
  }
}
