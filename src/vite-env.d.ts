/// <reference types="vite/client" />
import { RecaptchaVerifier } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
optimizeDeps: {
  include: ["framer-motion"]
}
