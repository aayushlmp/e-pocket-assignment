import { EMAIL_REGEX } from "@/constants";

export const validateEmail = (email: string) => EMAIL_REGEX.test(email);
