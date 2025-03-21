import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const AES_SECRET_KEY = process.env.AES_SECRET_KEY as string;
if (!AES_SECRET_KEY) {
  throw new Error('AES_SECRET_KEY not found in .env');
}

const cipherKey = CryptoJS.enc.Utf8.parse(AES_SECRET_KEY);

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, cipherKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

export function decrypt(ciphertext: string): string {
  return CryptoJS.AES.decrypt(ciphertext, cipherKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
}
