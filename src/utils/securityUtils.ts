import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my-very-secure-key';

export function encrypt(plaintext: string | undefined): string {
    if (plaintext == undefined) {
        return "";
    }

    try {
        const encrypted = CryptoJS.AES.encrypt(plaintext, SECRET_KEY).toString();
        return encodeURIComponent(encrypted);
    } catch (error) {
        console.error('Error encrypting data:', error);
        throw new Error('Encryption failed');
    }
}

export function decrypt(ciphertext: string | undefined): string {
    if (ciphertext == undefined) {
        return "";
    }

    try {
        const decodedCiphertext = decodeURIComponent(ciphertext);
        const bytes = CryptoJS.AES.decrypt(decodedCiphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error decrypting data:', error);
        throw new Error('Decryption failed');
    }
}

