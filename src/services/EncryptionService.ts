import {IEncryptionService} from "./interfaces/IEncryptionService.ts";

export class EncryptionService implements IEncryptionService{
    private static readonly PemHeader: string = '-----BEGIN PRIVATE KEY-----';
    private static readonly PemFooter: string = '-----END PRIVATE KEY-----';
    private static readonly TextEncoder: TextEncoder = new TextEncoder();
    private readonly publicCryptoKey: CryptoKey;

    private constructor(publicCryptoKey: CryptoKey) {
        this.publicCryptoKey = publicCryptoKey;
    }

    public static async Create(publicKey: string) {
        const publicCryptoKey = await this.ImportPublicKey(publicKey);
        return new EncryptionService(publicCryptoKey);
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

    public async decryptData(encryptedData: ArrayBuffer, privateKeyPem: string): Promise<string | null> {
        try {
            // Convert PEM-formatted private key to ArrayBuffer
            const pemContents = privateKeyPem.substring(
                EncryptionService.PemHeader.length,
                privateKeyPem.length - EncryptionService.PemFooter.length
            );
            const binaryDerString = atob(pemContents.replace(/\s+/g, ''));
            const binaryDer = Uint8Array.from(binaryDerString, (c) => c.charCodeAt(0));

            // Import the private key
            const privateKey = await window.crypto.subtle.importKey(
                'pkcs8',
                binaryDer.buffer,
                {
                    name: 'RSA-OAEP',
                    hash: 'SHA-256',
                },
                true,
                ['decrypt']
            );

            // Decrypt the data
            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: 'RSA-OAEP',
                },
                privateKey,
                encryptedData
            );

            // Decode the decrypted data to a string
            const decoder = new TextDecoder();
            return decoder.decode(decryptedData);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    private static ArrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
        const encryptedDataArray = new Uint8Array(arrayBuffer);
        return btoa(String.fromCharCode(...encryptedDataArray));
    }

    private static async ImportPublicKey(publicKey: string): Promise<CryptoKey> {
        return await window.crypto.subtle.importKey(
            'spki',
            this.StringToArrayBuffer(atob(publicKey)),
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256',
            },
            false,
            ['encrypt']
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
