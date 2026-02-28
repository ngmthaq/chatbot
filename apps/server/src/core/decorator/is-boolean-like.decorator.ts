import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, ValidationOptions } from 'class-validator';

export function IsBooleanLike(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value === 'boolean') return value;
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (value === 'TRUE') return true;
      if (value === 'FALSE') return false;
      if (value === 'on') return true;
      if (value === 'off') return false;
      if (value === '1') return true;
      if (value === '0') return false;
      if (value === 1) return true;
      if (value === 0) return false;
      return value;
    }),
    IsBoolean(validationOptions),
  );
}
