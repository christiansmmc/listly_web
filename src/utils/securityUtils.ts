import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my-very-secure-key';

export function encrypt(plaintext: string): string {
    try {
        return CryptoJS.AES.encrypt(plaintext, SECRET_KEY).toString();
    } catch (error) {
        console.error('Error encrypting data:', error);
        throw new Error('Encryption failed');
    }
}

export function decrypt(ciphertext: string): string {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error decrypting data:', error);
        throw new Error('Decryption failed');
    }
}
