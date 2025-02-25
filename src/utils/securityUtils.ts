import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my-secret-key';

export const encrypt = (plaintext: string | undefined) => {
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

export const decrypt = (ciphertext: string | undefined) => {
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

export const getAuthHeader = (roomPasscode: string | undefined) => {
    return {
        headers: {'X-Room-Passcode': decrypt(roomPasscode)}
    }
}

export const getRoomFromAccessToken = (accessToken: string) => {
    try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        return payload.sub || null;
    } catch (error) {
        console.error("Erro ao decodificar JWT:", error);
        return null;
    }
}