import { Prisma, PrismaClient } from '../../prisma-generated/client';
import { Action } from '../../src/feature/rbac/action';
import { Module } from '../../src/feature/rbac/module';
import { DefaultRole } from '../../src/feature/role/default-role';

export async function seedRbac(prisma: PrismaClient) {
  const roles = await prisma.role.findMany();

  // eslint-disable-next-line no-console
  console.log('\n🔑 Seeding RBAC permissions...');
  // eslint-disable-next-line no-console
  console.log(`   Available modules: ${Object.values(Module).join(', ')}`);
  // eslint-disable-next-line no-console
  console.log(`   Available actions: ${Object.values(Action).join(', ')}`);

  // Validate that all default roles exist
  for (const defaultRole of Object.values(DefaultRole)) {
    const role = roles.find((r) => r.name === defaultRole);
    if (!role) {
      throw new Error(`Required role '${defaultRole}' not found`);
    }
  }

  // Seed RBAC for Super Admin (full access to ALL modules and actions)
  const superAdminRole = roles.find(
    (role) => role.name === DefaultRole.SUPER_ADMIN,
  );
  if (superAdminRole) {
    // eslint-disable-next-line no-console
    console.log(`\n📋 Seeding full access for ${DefaultRole.SUPER_ADMIN}...`);
    await seedRbacForRole(
      prisma,
      superAdminRole,
      Object.values(Action),
      Object.values(Module),
    );
  }

  // Seed RBAC for Admin (full access to ALL modules and actions)
  const adminRole = roles.find((role) => role.name === DefaultRole.ADMIN);
  if (adminRole) {
    // eslint-disable-next-line no-console
    console.log(`\n📋 Seeding full access for ${DefaultRole.ADMIN}...`);
    await seedRbacForRole(
      prisma,
      adminRole,
      Object.values(Action),
      Object.values(Module),
    );
  }

  // Seed RBAC for User (no admin permissions)
  const userRole = roles.find((role) => role.name === DefaultRole.USER);
  if (userRole) {
    // eslint-disable-next-line no-console
    console.log(`\n📋 Seeding limited access for ${DefaultRole.USER}...`);
    await seedRbacForRole(prisma, userRole, [], []);
  }

  // eslint-disable-next-line no-console
  console.log('\n✅ RBAC seeding completed!\n');
}

async function seedRbacForRole(
  prisma: PrismaClient,
  role: Prisma.RoleModel,
  allowedActions: Action[],
  allowedModules: Module[],
) {
  const modules = allowedModules.length > 0 ? allowedModules : [];
  const actions = allowedActions.length > 0 ? allowedActions : [];

  if (modules.length === 0 || actions.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`   ℹ️  No permissions for role: ${role.name}`);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(
    `   📝 Granting ${modules.length} modules × ${actions.length} actions...`,
  );

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

  // Verify ADMIN module permissions
  const adminPermissions = rbacList.filter(
    (rbac) => rbac.module === Module.ADMIN,
  );

  // eslint-disable-next-line no-console
  console.log(
    `   ✓ Created ${rbacList.length} RBAC entries for role: ${role.name}`,
  );

  if (adminPermissions.length > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `   ✓ Including ${adminPermissions.length} ADMIN module permissions: ${adminPermissions.map((p) => p.action).join(', ')}`,
    );
  }
}
