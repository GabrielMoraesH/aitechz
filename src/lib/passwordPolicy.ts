export const MIN_PASSWORD_LENGTH = 6;

export function hasMinimumPasswordLength(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}
