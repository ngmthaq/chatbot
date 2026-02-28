import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { ExceptionDict } from '../exception/exception-dict';

@Injectable()
@ValidatorConstraint({ async: true })
export class MultipleIdsWithCsvStringFormat implements ValidatorConstraintInterface {
  public async validate(ids: string, _args: ValidationArguments) {
    const idArray = ids.split(',');
    return idArray.every((id) => /^\d+$/.test(id));
  }

  public defaultMessage(_args: ValidationArguments) {
    return ExceptionDict.multipleIdsWithCsvStringFormat();
  }
}
