import * as bcrypt from 'bcrypt';

import { PrismaClient } from '../../prisma-generated/client';
import { DefaultRole } from '../../src/feature/role/default-role';

export async function seedUsers(prisma: PrismaClient) {
  // Hash default password for all seeded users
  const hashedPassword = await bcrypt.hash('P@ssw0rd', 10);

  // Validate that roles exist
  const roles = await prisma.role.findMany();
  const roleIds = Object.values(DefaultRole).map((roleName) => {
    const role = roles.find((r) => r.name === roleName);
    if (role) return { name: roleName, id: role.id };
    throw new Error(`Role '${roleName}' not found. Please seed roles first.`);
  });

  // Seed super admin
  const superAdminRoleId = roleIds.find(
    (r) => r.name === DefaultRole.SUPER_ADMIN,
  )!.id;
  const admin = await prisma.user.upsert({
    where: { email: 'admin@seeder.com' },
    update: {
      name: 'Admin',
      roleId: superAdminRoleId,
      password: hashedPassword,
      activatedAt: new Date(),
    },
    create: {
      email: 'admin@seeder.com',
      name: 'Admin',
      roleId: superAdminRoleId,
      password: hashedPassword,
      activatedAt: new Date(),
    },
  });

  // Seed admin
  const adminRoleId = roleIds.find((r) => r.name === DefaultRole.ADMIN)!.id;
  const alice = await prisma.user.upsert({
    where: { email: 'alice@seeder.com' },
    update: {
      name: 'Alice',
      roleId: adminRoleId,
      password: hashedPassword,
      activatedAt: new Date(),
    },
    create: {
      email: 'alice@seeder.com',
      name: 'Alice',
      roleId: adminRoleId,
      password: hashedPassword,
      activatedAt: new Date(),
    },
  });

  // Seed standard user
  const userRoleId = roleIds.find((r) => r.name === DefaultRole.USER)!.id;
  const bob = await prisma.user.upsert({
    where: { email: 'bob@seeder.com' },
    update: {
      name: 'Bob',
      roleId: userRoleId,
      password: hashedPassword,
      activatedAt: new Date(),
    },
    create: {
      email: 'bob@seeder.com',
      name: 'Bob',
      roleId: userRoleId,
      password: hashedPassword,
      activatedAt: new Date(),
    },
  });

  // eslint-disable-next-line no-console
  console.log(`✓ Seeded 3 users: ${admin.email}, ${alice.email}, ${bob.email}`);
}
