import { PrismaClient } from '../../prisma-generated/client';
import { DefaultRole } from '../../src/feature/role/default-role';

export async function seedRole(prisma: PrismaClient) {
  const roles = await Promise.all(
    Object.values(DefaultRole).map(async (roleName) => {
      return prisma.role.upsert({
        where: { name: roleName },
        update: { name: roleName },
        create: { name: roleName },
      });
    }),
  );

  // eslint-disable-next-line no-console
  console.log(`✓ Seeded ${roles.length} roles`);
}
