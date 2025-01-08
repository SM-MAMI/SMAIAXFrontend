interface IEncryptionService {
    encryptData: (data: string) => Promise<string>;
}

export class EncryptionService implements IEncryptionService {
    private static readonly TextEncoder: TextEncoder = new TextEncoder();
    private readonly publicCryptoKey: CryptoKey;

    private constructor(publicCryptoKey: CryptoKey) {
        this.publicCryptoKey = publicCryptoKey;
    }

    public static async Create(publicKey: string): Promise<EncryptionService> {
        const publicCryptoKey = await this.ImportPublicKey(publicKey);
        return new EncryptionService(publicCryptoKey);
    }

    public async encryptData(data: string): Promise<string> {
        const encodedData = EncryptionService.TextEncoder.encode(data);
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP', // Only specify the algorithm name here
            },
            this.publicCryptoKey,
            encodedData
        );
        return EncryptionService.ArrayBufferToBase64(encryptedData);
    }

    private static ArrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
        }
        return window.btoa(binaryString);
    }

    private static async ImportPublicKey(publicKey: string): Promise<CryptoKey> {
        const rawKey = EncryptionService.Base64ToArrayBuffer(publicKey); // Decode Base64
        return await window.crypto.subtle.importKey(
            'spki', // Raw public key format
            rawKey,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256', // Match the back-end's RSA-OAEP configuration
            },
            true, // Extractable
            ['encrypt'] // Key usage
        );
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

    // private static ParseXmlPublicKey(xmlKey: string): { modulus: string; exponent: string } {
    //     const parser = new DOMParser();
    //     const xmlDoc = parser.parseFromString(atob(xmlKey), 'text/xml');
    //     const modulus = xmlDoc.getElementsByTagName('Modulus')[0].textContent || '';
    //     const exponent = xmlDoc.getElementsByTagName('Exponent')[0].textContent || '';
    //     return { modulus, exponent };
    // }
    //
    // private static ConstructSpkiKey({ modulus, exponent }: { modulus: string; exponent: string }): ArrayBuffer {
    //     // Convert the modulus and exponent into DER-encoded SPKI format
    //     const mod = this.Base64ToUint8Array(modulus);
    //     const exp = this.Base64ToUint8Array(exponent);
    //
    //     const modLen = mod.length;
    //     const expLen = exp.length;
    //
    //     const totalLen = modLen + expLen + 4;
    //     const spki = new Uint8Array(totalLen);
    //
    //     spki.set([0x30, 0x82, modLen >> 8, modLen & 0xff]); // Sequence header
    //     spki.set(mod, 4); // Modulus
    //     spki.set([0x02, expLen], 4 + modLen); // Exponent header
    //     spki.set(exp, 6 + modLen); // Exponent
    //
    //     return spki.buffer;
    // }

    // private static Base64ToUint8Array(base64: string): Uint8Array {
    //     const binaryString = window.atob(base64);
    //     const len = binaryString.length;
    //     const bytes = new Uint8Array(len);
    //     for (let i = 0; i < len; i++) {
    //         bytes[i] = binaryString.charCodeAt(i);
    //     }
    //     return bytes;
    // }
}
