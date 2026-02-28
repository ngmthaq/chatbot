import { Global, Module } from '@nestjs/common';

import { MultipleIdsWithCsvStringFormat } from './multiple-ids-with-csv-string-format.validator';
import { MultipleRbacIdsShouldExist } from './multiple-rbac-ids-should-exist.validator';
import { MultipleRoleIdsShouldExist } from './multiple-role-ids-should-exist.validator';
import { MultipleRoleIdsShouldNotBeDefault } from './multiple-role-ids-should-not-be-default.validator';
import { MultipleRoleIdsShouldNotHaveRelationships } from './multiple-role-ids-should-not-have-relationships.validator';
import { MultipleUserIdsShouldExist } from './multiple-user-ids-should-exist.validator';
import { RbacIdShouldExist } from './rbac-id-should-exist.validator';
import { RoleIdShouldExist } from './role-id-should-exist.validator';
import { RoleIdShouldNotBeDefault } from './role-id-should-not-be-default.validator';
import { RoleIdShouldNotHaveRelationships } from './role-id-should-not-have-relationships.validator';
import { RoleNameShouldNotExist } from './role-name-should-not-exist.validator';
import { TokenShouldExist } from './token-should-exist.validator';
import { UserEmailShouldExist } from './user-email-should-exist.validator';
import { UserEmailShouldNotExist } from './user-email-should-not-exist.validator';
import { UserIdShouldExist } from './user-id-should-exist.validator';

const providers = [
  UserEmailShouldNotExist,
  MultipleIdsWithCsvStringFormat,
  UserIdShouldExist,
  MultipleUserIdsShouldExist,
  TokenShouldExist,
  UserEmailShouldExist,
  RoleIdShouldExist,
  RbacIdShouldExist,
  MultipleRbacIdsShouldExist,
  RoleNameShouldNotExist,
  MultipleRoleIdsShouldExist,
  RoleIdShouldNotBeDefault,
  RoleIdShouldNotHaveRelationships,
  MultipleRoleIdsShouldNotBeDefault,
  MultipleRoleIdsShouldNotHaveRelationships,
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class CoreValidatorModule {}
