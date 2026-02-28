import { IsStrongPasswordOptions } from 'class-validator';

import {
  generateRandomNumericString,
  generateRandomString,
  generateRandonSpecialCharacterString,
} from '../../utils/string';

export const strongPasswordConfig: IsStrongPasswordOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export function generateStrongPassword() {
  let password = '';
  if (strongPasswordConfig.minLowercase) {
    password += generateRandomString(
      strongPasswordConfig.minLowercase,
    ).toLowerCase();
  }

  if (strongPasswordConfig.minUppercase) {
    password += generateRandomString(
      strongPasswordConfig.minUppercase,
    ).toUpperCase();
  }

  if (strongPasswordConfig.minNumbers) {
    password += generateRandomNumericString(strongPasswordConfig.minNumbers);
  }

  if (strongPasswordConfig.minSymbols) {
    password += generateRandonSpecialCharacterString(
      strongPasswordConfig.minSymbols,
    );
  }

  while (password.length < (strongPasswordConfig.minLength || 8)) {
    password += generateRandomString(1);
  }

  return password;
}
