import { IsStrongPasswordOptions } from 'class-validator';

function standardizeRule(rule: string, params?: Record<string, unknown>) {
  return JSON.stringify({ rule, params });
}

export class ExceptionDict {
  public static resourceNotFound() {
    return standardizeRule('resourceNotFound');
  }

  public static isString() {
    return standardizeRule('isString');
  }

  public static isNotEmpty() {
    return standardizeRule('isNotEmpty');
  }

  public static isEmail() {
    return standardizeRule('isEmail');
  }

  public static minLength(minLength: number) {
    return standardizeRule('minLength', { minLength });
  }

  public static isStrongPassword(config: IsStrongPasswordOptions = {}) {
    return standardizeRule('isStrongPassword', config);
  }

  public static userEmailShouldNotExist() {
    return standardizeRule('userEmailShouldNotExist');
  }

  public static invalidCredentials() {
    return standardizeRule('invalidCredentials');
  }

  public static tokenExpired() {
    return standardizeRule('tokenExpired');
  }

  public static multipleIdsWithCsvStringFormat() {
    return standardizeRule('multipleIdsWithCsvStringFormat');
  }

  public static isNumberString() {
    return standardizeRule('isNumberString');
  }

  public static isDate() {
    return standardizeRule('isDate');
  }

  public static isDateString() {
    return standardizeRule('isDateString');
  }

  public static isEnum(enumValue: unknown) {
    return standardizeRule('isEnum', { enum: enumValue });
  }

  public static userIdShouldExist() {
    return standardizeRule('userIdShouldExist');
  }

  public static multipleUserIdsShouldExist() {
    return standardizeRule('multipleUserIdsShouldExist');
  }

  public static tokenShouldExist() {
    return standardizeRule('tokenShouldExist');
  }

  public static userEmailShouldExist() {
    return standardizeRule('userEmailShouldExist');
  }

  public static roleIdShouldExist() {
    return standardizeRule('roleIdShouldExist');
  }

  public static roleNameShouldNotExist() {
    return standardizeRule('roleNameShouldNotExist');
  }

  public static multipleRoleIdsShouldExist() {
    return standardizeRule('multipleRoleIdsShouldExist');
  }

  public static roleIdShouldNotBeDefault() {
    return standardizeRule('roleIdShouldNotBeDefault');
  }

  public static roleIdShouldNotHaveRelationships() {
    return standardizeRule('roleIdShouldNotHaveRelationships');
  }

  public static rbacIdShouldExist() {
    return standardizeRule('rbacIdShouldExist');
  }

  public static multipleRbacIdsShouldExist() {
    return standardizeRule('multipleRbacIdsShouldExist');
  }

  public static isInt() {
    return standardizeRule('isInt');
  }

  public static isBoolean() {
    return standardizeRule('isBoolean');
  }
}
