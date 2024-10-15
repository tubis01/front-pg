import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({providedIn: 'root'})


export class EncryptionService {

  private secretKey: string = 'myesbale12345678901234567890123456';  // Clave AES de 32 bytes para AES-256

  // Cifrar datos
  encryptData(data: any): string {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(this.secretKey), {
      keySize: 256 / 32,
      mode: CryptoJS.mode.ECB,  // Usar ECB
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();  // Devuelve la cadena encriptada en formato Base64
  }

  // Desencriptar datos
  decryptData(encryptedData: string): any {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(this.secretKey), {
      keySize: 256 / 32,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convertir los datos desencriptados de Base64 a una cadena UTF-8
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
}

