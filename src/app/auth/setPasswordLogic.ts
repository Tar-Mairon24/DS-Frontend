export interface PasswordValidation {
length: boolean;
upper: boolean;
number: boolean;
}


export const validatePassword = (password: string): PasswordValidation => {
return {
length: password.length >= 8,
upper: /[A-Z]/.test(password),
number: /[0-9]/.test(password),
};
};


export const passwordsMatch = (password: string, confirm: string): boolean => {
return password === confirm;
};