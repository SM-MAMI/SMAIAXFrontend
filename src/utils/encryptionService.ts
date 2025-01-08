import JSEncrypt from 'jsencrypt';

export class EncryptionService {
    private readonly encryptor: JSEncrypt;

    private constructor(encryptor: JSEncrypt) {
        this.encryptor = encryptor;
    }

    public static Create(publicKeyXml: string): EncryptionService {
        const pemKey = this.ConvertXmlToPem(publicKeyXml);
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(pemKey);
        return new EncryptionService(encryptor);
    }

    public encryptData(data: string): string {
        if (data.length > 512) {
            throw new Error('Data size exceeds the RSA encryption limit.');
        }

        const encryptedData = this.encryptor.encrypt(data);
        if (!encryptedData) {
            throw new Error('Encryption failed. Please check the public key and data.');
        }
        return encryptedData;
    }

    private static ConvertXmlToPem(xmlKey: string): string {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlKey, 'text/xml');
        const modulus = xmlDoc.getElementsByTagName('Modulus')[0].textContent || '';
        const exponent = xmlDoc.getElementsByTagName('Exponent')[0].textContent || '';

        const modulusBase64 = modulus.replace(/\s+/g, '');
        const exponentBase64 = exponent.replace(/\s+/g, '');

        const modulusBytes = this.Base64ToUint8Array(modulusBase64);
        const exponentBytes = this.Base64ToUint8Array(exponentBase64);

        const der = this.ConstructDerKey(modulusBytes, exponentBytes);

        const base64Der = window.btoa(String.fromCharCode(...new Uint8Array(der)));
        const pem = `-----BEGIN PUBLIC KEY-----\n${(base64Der.match(/.{1,64}/g) ?? []).join('\n')}\n-----END PUBLIC KEY-----`;

        return pem;
    }

    private static ConstructDerKey(modulusBytes: Uint8Array, exponentBytes: Uint8Array): ArrayBuffer {
        const modulusLength = modulusBytes.length;
        const exponentLength = exponentBytes.length;

        const modulusHeader =
            modulusLength > 0x7f ? [0x02, 0x82, modulusLength >> 8, modulusLength & 0xff] : [0x02, modulusLength];
        const exponentHeader = [0x02, exponentLength];

        const sequenceLength = modulusHeader.length + modulusLength + exponentHeader.length + exponentLength;
        const sequenceHeader =
            sequenceLength > 0x7f ? [0x30, 0x82, sequenceLength >> 8, sequenceLength & 0xff] : [0x30, sequenceLength];

        const der = new Uint8Array(
            sequenceHeader.length + modulusHeader.length + modulusLength + exponentHeader.length + exponentLength
        );
        let offset = 0;

        der.set(sequenceHeader, offset);
        offset += sequenceHeader.length;

        der.set(modulusHeader, offset);
        offset += modulusHeader.length;

        der.set(modulusBytes, offset);
        offset += modulusBytes.length;

        der.set(exponentHeader, offset);
        offset += exponentHeader.length;

        der.set(exponentBytes, offset);

        return der.buffer;
    }

    private static Base64ToUint8Array(base64: string): Uint8Array {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
}
