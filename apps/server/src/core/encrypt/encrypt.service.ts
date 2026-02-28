import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { ConfigType } from '../config/config-type';

@Injectable()
export class EncryptService {
  public constructor(private configService: ConfigService) {}

  public async encrypt(text: string) {
    const algorithm =
      this.configService.get<ConfigType['cryptoAlgorithm']>('cryptoAlgorithm');
    const secret =
      this.configService.get<ConfigType['cryptoSecret']>('cryptoSecret');
    const salt = randomBytes(16);
    const key = await new Promise<Buffer>((resolve, reject) => {
      scrypt(secret, salt, 32, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
  }

  public async decrypt(encrypted: string) {
    const algorithm =
      this.configService.get<ConfigType['cryptoAlgorithm']>('cryptoAlgorithm');
    const secret =
      this.configService.get<ConfigType['cryptoSecret']>('cryptoSecret');
    const parts = encrypted.split(':');
    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    const key = await new Promise<Buffer>((resolve, reject) => {
      scrypt(secret, salt, 32, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  public async hash(text: string) {
    const saltRounds =
      this.configService.get<ConfigType['saltRounds']>('saltRounds');
    return bcrypt.hash(text, saltRounds);
  }

  public async isMatch(text: string, hashedText: string) {
    return bcrypt.compare(text, hashedText);
  }
}
