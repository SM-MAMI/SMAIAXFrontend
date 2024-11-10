export interface IEncryptionService {
    encryptData: (data: string) => Promise<string>;
    decryptData: (encryptedData: ArrayBuffer, privateKeyPem: string) => Promise<string | null>;
}