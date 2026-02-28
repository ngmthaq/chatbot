import { Prisma, PrismaClient } from '../../prisma-generated/client';
import { Action } from '../../src/feature/rbac/action';
import { Module } from '../../src/feature/rbac/module';
import { DefaultRole } from '../../src/feature/role/default-role';

export async function seedRbac(prisma: PrismaClient) {
  const roles = await prisma.role.findMany();

  // Validate that all default roles exist
  for (const defaultRole of Object.values(DefaultRole)) {
    const role = roles.find((r) => r.name === defaultRole);
    if (!role) {
      throw new Error(`Required role '${defaultRole}' not found`);
    }
  }

  // Seed RBAC for Super Admin (full access)
  const superAdminRole = roles.find(
    (role) => role.name === DefaultRole.SUPER_ADMIN,
  );
  if (superAdminRole) {
    await seedRbacForRole(prisma, superAdminRole);
  }

  // Seed RBAC for Admin (full access)
  const adminRole = roles.find((role) => role.name === DefaultRole.ADMIN);
  if (adminRole) {
    await seedRbacForRole(prisma, adminRole);
  }

  // Seed RBAC for User (read-only access)
  const userRole = roles.find((role) => role.name === DefaultRole.USER);
  if (userRole) {
    await seedRbacForRole(prisma, userRole, [], []);
  }
}

async function seedRbacForRole(
  prisma: PrismaClient,
  role: Prisma.RoleModel,
  allowedActions?: Action[],
  allowedModules?: Module[],
) {
  const modules = allowedModules || Object.values(Module);
  const actions = allowedActions || Object.values(Action);

  const rbacEntries: Prisma.RbacUpsertArgs[] = [];
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];

    for (let j = 0; j < actions.length; j++) {
      const action = actions[j];

      rbacEntries.push({
        where: {
          roleId_module_action: {
            roleId: role.id,
            module,
            action,
          },
        },
        update: {
          roleId: role.id,
          module,
          action,
        },
        create: {
          roleId: role.id,
          module,
          action,
        },
      });
    }
  }

  const rbacList = await Promise.all(
    rbacEntries.map(async (rbacUpsertArgs) => {
      return prisma.rbac.upsert(rbacUpsertArgs);
    }),
  );

  // eslint-disable-next-line no-console
  console.log(
    `✓ Created ${rbacList.length} RBAC entries for role: ${role.name}`,
  );
}
