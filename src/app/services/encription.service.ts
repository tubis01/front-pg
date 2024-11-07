// encryption.service.ts
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = 'jD9pX!z3aQ5bH2@W5v#U4dL3r%Z1kV8p';
  private iv = CryptoJS.enc.Utf8.parse('a3f7c9d2a3f7c9d2'); // Debe coincidir con el backend

  encryptPayload(data: any): string {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(this.secretKey), {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decryptPayload(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(this.secretKey), {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}
