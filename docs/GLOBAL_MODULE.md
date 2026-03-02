# ALLOWANCE_GLOBAL_MODULES

This document describes the global modules in the application.
Global modules are modules that are imported once and can be used across the entire application
without needing to import them in every module.

## Global Modules

### 1. CoreConfigModule

**Location**: `apps/server/src/core/config/config.module.ts`

**Description**: Provides centralized configuration management using NestJS ConfigModule. Loads environment variables from `.env` file and makes configuration settings available throughout the application via `ConfigService`.

**Exports**:

- `ConfigModule` (from @nestjs/config)
- `ConfigService` (accessible via dependency injection)

**Use Cases**:

- Access environment variables
- Get application configuration settings (database, JWT, crypto, etc.)
- Type-safe configuration with `ConfigType` interface

**Example**:

```typescript
constructor(private configService: ConfigService) {
  const port = this.configService.get<number>('port');
  const jwtSecret = this.configService.get<string>('jwtSecret');
}
```

---

### 2. CoreDatabaseModule

**Location**: `apps/server/src/core/database/database.module.ts`

**Description**: Provides Prisma ORM database access layer. Automatically configures Prisma Client with MariaDB adapter and connection settings from environment variables. Handles database connection lifecycle and logging.

**Exports**:

- `PrismaService` - Extended PrismaClient with application-specific configuration

**Use Cases**:

- Perform database CRUD operations
- Execute complex queries with Prisma's type-safe query builder
- Transaction management
- Database migrations

**Example**:

```typescript
constructor(private prismaService: PrismaService) {}

async findUser(id: number) {
  return this.prismaService.user.findUnique({ where: { id } });
}
```

---

### 3. CoreEncryptModule

**Location**: `apps/server/src/core/encrypt/encrypt.module.ts`

**Description**: Provides encryption, decryption, and password hashing utilities using Node.js crypto and bcrypt libraries. Supports AES encryption with dynamic salt and IV generation.

**Exports**:

- `EncryptService` - Encryption/decryption and password hashing service

**Use Cases**:

- Hash passwords before storing in database
- Verify password hashes during authentication
- Encrypt sensitive data (e.g., API keys, tokens)
- Decrypt encrypted data

**Methods**:

- `encrypt(text: string)` - Encrypt text using AES algorithm
- `decrypt(encryptedText: string)` - Decrypt encrypted text
- `hash(password: string)` - Hash password using bcrypt
- `compare(password: string, hash: string)` - Verify password against hash

**Example**:

```typescript
constructor(private encryptService: EncryptService) {}

async hashPassword(password: string) {
  return this.encryptService.hash(password);
}

async verifyPassword(password: string, hash: string) {
  return this.encryptService.compare(password, hash);
}
```

---

### 4. CoreValidatorModule

**Location**: `apps/server/src/core/validator/validator.module.ts`

**Description**: Provides custom validation decorators for DTOs. These validators integrate with class-validator and perform database-aware validations (e.g., checking if entities exist, preventing duplicate emails, enforcing business rules).

**Exports**:

- `UserEmailShouldNotExist` - Validates email uniqueness for registration
- `UserEmailShouldExist` - Validates email exists for login/recovery
- `UserIdShouldExist` - Validates user ID exists
- `MultipleUserIdsShouldExist` - Validates multiple user IDs exist
- `RoleIdShouldExist` - Validates role ID exists
- `RoleNameShouldNotExist` - Validates role name uniqueness
- `RoleIdShouldNotBeDefault` - Prevents deletion of default roles
- `RoleIdShouldNotHaveRelationships` - Prevents deletion of roles with users
- `RbacIdShouldExist` - Validates RBAC permission ID exists
- `MultipleRbacIdsShouldExist` - Validates multiple RBAC IDs exist
- `MultipleIdsWithCsvStringFormat` - Validates CSV format for multiple IDs
- `TokenShouldExist` - Validates activation/reset token exists

**Use Cases**:

- DTO validation with database constraints
- Business rule enforcement at validation layer
- Provide meaningful error messages for invalid data

**Example**:

```typescript
export class RegisterDto {
  @UserEmailShouldNotExist({ message: "Email already exists" })
  email: string;
}

export class DeleteRoleDto {
  @RoleIdShouldNotBeDefault({ message: "Cannot delete default role" })
  @RoleIdShouldNotHaveRelationships({ message: "Role has active users" })
  id: number;
}
```

---

### 5. JwtModule

**Location**: `apps/server/src/feature/auth/auth.module.ts` (configured with `global: true`)

**Description**: Provides JWT (JSON Web Token) functionality for authentication and authorization. Automatically configured with application secrets and expiration settings from environment variables. Made globally available for token generation and verification across all modules.

**Exports**:

- `JwtService` - JWT token generation and verification service

**Use Cases**:

- Generate access tokens after login
- Generate refresh tokens for token renewal
- Verify JWT tokens in authentication guards
- Decode token payloads

**Configuration**:

- Secret: From `JWT_SECRET` environment variable
- Expiration: From `JWT_EXPIRATION` environment variable
- Global registration: Available in all modules without import

**Example**:

```typescript
constructor(private jwtService: JwtService) {}

async generateToken(userId: number) {
  return this.jwtService.sign({ sub: userId });
}

async verifyToken(token: string) {
  return this.jwtService.verify(token);
}
```

---

### 6. CoreThrottlerModule

**Location**: `apps/server/src/core/throttler/throttler.module.ts`

**Description**: Provides rate limiting functionality to protect the application from abuse and brute-force attacks. Configures multiple throttling contexts (short, medium, long) with different time windows and request limits. Marked as global, so `ThrottlerGuard` is automatically available throughout the application.

**Exports**:

- `ThrottlerModule` - NestJS throttler module (@nestjs/throttler)
- `ThrottlerGuard` - Guard to apply rate limiting to routes

**Rate Limiting Tiers**:

- **Short**: 3 requests per 1 second (1000ms)
- **Medium**: 20 requests per 10 seconds (10000ms)
- **Long**: 100 requests per 60 seconds (60000ms)

**Use Cases**:

- Protect API endpoints from brute-force attacks
- Prevent abuse of public endpoints (login, register, forgot password)
- Rate limit resource-intensive operations
- Apply different rate limits to different route contexts

**Usage**:

Add `@UseGuards(ThrottlerGuard)` to controllers or specific routes:

```typescript
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  // All routes in this controller are rate-limited
}
```

**Customizing Rate Limits**:

Use `@Throttle()` decorator to override default limits:

```typescript
import { Throttle } from '@nestjs/throttler';

@Post('login')
@Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
async login(@Body() dto: LoginDto) {
  // Login logic
}
```

**Example**:

```typescript
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('admin')
@UseGuards(ThrottlerGuard, AuthGuard, RbacGuard)
export class AdminController {
  // Rate limiting applied before auth checks
}
```

---

## Best Practices

### When to Use Global Modules

✅ **Use global modules for**:

- Core infrastructure services (database, config, logging)
- Security utilities (encryption, JWT)
- Shared validation logic
- Services needed by 90%+ of feature modules

❌ **Avoid global modules for**:

- Feature-specific services
- Business logic services
- Services with heavy dependencies
- Services that might create circular dependencies

### Importing Global Modules

Global modules are automatically available, but you still need to inject their services:

```typescript
// ✅ Correct - Just inject the service
constructor(
  private prismaService: PrismaService,
  private configService: ConfigService,
) {}

// ❌ Wrong - Don't import the global module again
@Module({
  imports: [CoreDatabaseModule], // Not needed!
})
```

### Performance Considerations

- Global modules are instantiated once at application startup
- Services are singletons shared across all modules
- Reduces module initialization overhead
- Be cautious with stateful global services

---

## Summary

| Module              | Provider           | Purpose                       | Location          |
| ------------------- | ------------------ | ----------------------------- | ----------------- |
| CoreConfigModule    | ConfigService      | Environment & configuration   | `core/config`     |
| CoreDatabaseModule  | PrismaService      | Database access (ORM)         | `core/database`   |
| CoreEncryptModule   | EncryptService     | Encryption & password hashing | `core/encrypt`    |
| CoreValidatorModule | Various validators | Custom DTO validations        | `core/validator`  |
| JwtModule           | JwtService         | JWT token management          | `feature/auth`    |
| CoreThrottlerModule | ThrottlerGuard     | Rate limiting & throttling    | `core/throttler`  |

All these modules are marked with `@Global()` or `global: true` and are automatically available throughout the application without explicit imports.
