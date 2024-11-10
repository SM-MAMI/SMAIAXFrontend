import { IEncryptionService } from './interfaces/IEncryptionService.ts';

export class EncryptionService implements IEncryptionService {
    private static readonly TextEncoder: TextEncoder = new TextEncoder();
    private static readonly TextDecoder: TextDecoder = new TextDecoder();
    private readonly publicCryptoKey: CryptoKey;
    private readonly privateCryptoKey?: CryptoKey;

    private constructor(publicCryptoKey: CryptoKey, privateCryptoKey?: CryptoKey) {
        this.publicCryptoKey = publicCryptoKey;
        this.privateCryptoKey = privateCryptoKey;
    }

    public static async Create(publicKey: string, privateKey?: string) {
        const publicCryptoKey = await this.ImportPublicKey(publicKey);
        const privateCryptoKey = privateKey ? await this.ImportPrivateKey(privateKey) : undefined;
        return new EncryptionService(publicCryptoKey, privateCryptoKey);
    }

    public async encryptData(data: string): Promise<string> {
        const encodedData = EncryptionService.TextEncoder.encode(data);
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
            },
            this.publicCryptoKey,
            encodedData
        );
        return EncryptionService.ArrayBufferToBase64(encryptedData);
    }

    public async decryptData(encryptedData: string): Promise<string> {
        if (!this.privateCryptoKey) {
            throw new Error('Private key is required for decryption.');
        }

        const encryptedArrayBuffer = EncryptionService.Base64ToArrayBuffer(encryptedData);
        const decryptedArrayBuffer = await window.crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP',
            },
            this.privateCryptoKey,
            encryptedArrayBuffer
        );
        return EncryptionService.TextDecoder.decode(decryptedArrayBuffer);
    }

    private static ArrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
        }
        return window.btoa(binaryString);
    }

    private static Base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    private static async ImportPublicKey(publicKey: string): Promise<CryptoKey> {
        return await window.crypto.subtle.importKey(
            'spki',
            this.StringToArrayBuffer(window.atob(publicKey)),
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256',
            },
            false,
            ['encrypt']
        );
    }

    private static async ImportPrivateKey(privateKey: string): Promise<CryptoKey> {
        return await window.crypto.subtle.importKey(
            'pkcs8',
            this.StringToArrayBuffer(window.atob(privateKey)),
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256',
            },
            false,
            ['decrypt']
        );
    }

    private static StringToArrayBuffer(str: string): ArrayBuffer {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}
