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

  // RAG & Chat errors
  public static conversationNotFound() {
    return standardizeRule('conversationNotFound');
  }

  public static conversationAccessDenied() {
    return standardizeRule('conversationAccessDenied');
  }

  public static documentNotFound() {
    return standardizeRule('documentNotFound');
  }

  public static documentAccessDenied() {
    return standardizeRule('documentAccessDenied');
  }

  public static invalidFileType() {
    return standardizeRule('invalidFileType');
  }

  public static fileTooLarge() {
    return standardizeRule('fileTooLarge');
  }

  public static ollamaServiceUnavailable() {
    return standardizeRule('ollamaServiceUnavailable');
  }

  public static qdrantServiceUnavailable() {
    return standardizeRule('qdrantServiceUnavailable');
  }

  public static embeddingGenerationFailed() {
    return standardizeRule('embeddingGenerationFailed');
  }

  public static vectorSearchFailed() {
    return standardizeRule('vectorSearchFailed');
  }

  public static promptInjectionDetected() {
    return standardizeRule('promptInjectionDetected');
  }

  public static messageTooLong() {
    return standardizeRule('messageTooLong');
  }

  public static documentProcessingFailed() {
    return standardizeRule('documentProcessingFailed');
  }

  public static isNumber() {
    return standardizeRule('isNumber');
  }

  public static isPositive() {
    return standardizeRule('isPositive');
  }

  // Authentication & Authorization errors
  public static userNotAuthenticated() {
    return standardizeRule('userNotAuthenticated');
  }

  public static adminRoleRequired() {
    return standardizeRule('adminRoleRequired');
  }

  // Document management errors
  public static noFileUploaded() {
    return standardizeRule('noFileUploaded');
  }

  public static documentDeletionFailed() {
    return standardizeRule('documentDeletionFailed');
  }

  public static documentChunkingFailed() {
    return standardizeRule('documentChunkingFailed');
  }

  // Vector database errors
  public static vectorCollectionCreationFailed() {
    return standardizeRule('vectorCollectionCreationFailed');
  }

  public static vectorCollectionDeletionFailed() {
    return standardizeRule('vectorCollectionDeletionFailed');
  }

  public static vectorStorageFailed() {
    return standardizeRule('vectorStorageFailed');
  }

  public static vectorDeletionFailed() {
    return standardizeRule('vectorDeletionFailed');
  }

  // AI/ML service errors
  public static imageProcessingFailed() {
    return standardizeRule('imageProcessingFailed');
  }

  public static speechToTextFailed() {
    return standardizeRule('speechToTextFailed');
  }

  public static textToSpeechFailed() {
    return standardizeRule('textToSpeechFailed');
  }
}
