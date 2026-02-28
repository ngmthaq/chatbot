import { ValidationError } from 'class-validator';

import { ExceptionBuilder } from './exception-builder';

function extractErrors(
  errors: ValidationError[],
  formattedErrors: Record<string, string[]>,
  parentPath = '',
) {
  for (const error of errors) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      formattedErrors[propertyPath] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      extractErrors(error.children, formattedErrors, propertyPath);
    }
  }
}

export function exceptionFactory(errors: ValidationError[]) {
  const formattedErrors: Record<string, string[]> = {};
  extractErrors(errors, formattedErrors);

  return ExceptionBuilder.badRequest(formattedErrors);
}
