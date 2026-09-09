export function logger(...args: unknown[]): void {
  // eslint-disable-next-line no-console
  console.log(new Date().toISOString(), ...args);
}
