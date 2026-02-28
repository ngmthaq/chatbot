import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, ValidationOptions } from 'class-validator';

export function IsTrimmedString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value === 'string') return value.trim();
      return value;
    }),
    IsString(validationOptions),
  );
}
