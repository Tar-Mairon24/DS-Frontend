export function validateCode(code: string): boolean {
return /^[0-9]{6}$/.test(code);
}