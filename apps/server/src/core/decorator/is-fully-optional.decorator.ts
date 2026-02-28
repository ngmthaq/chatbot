import { ValidateIf } from 'class-validator';

export function IsFullyOptional(): PropertyDecorator {
  return ValidateIf((_, value) => {
    if (typeof value === 'string') {
      value = value.trim();
      return value !== '';
    }

    return value !== null && value !== undefined;
  });
}
