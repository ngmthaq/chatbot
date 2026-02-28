const { mkdir, cp } = require('node:fs/promises');
const { resolve } = require('node:path');
const { execPromise } = require('./helpers.cjs');

const mainBackendApp = 'apps/server';
const subBackendApps = ['apps/server-2'];

function getPrismaGeneratedPath(appPath) {
  return resolve(__dirname, '..', appPath, 'prisma-generated');
}

async function generatePrismaClient() {
  await execPromise('npx turbo run db:generate');
  const rootPrismaGenerated = getPrismaGeneratedPath(mainBackendApp);
  console.log('Root Prisma generated path:', rootPrismaGenerated);

  const response = await Promise.allSettled(
    subBackendApps.map(async (app) => {
      const path = getPrismaGeneratedPath(app);
      await execPromise(`rm -rf ${path}`);
      await mkdir(path, { mode: 0o777, recursive: true });
      await cp(rootPrismaGenerated, path, { recursive: true });
      return `Prisma client generated for ${app}`;
    }),
  );

  response.forEach((res) => {
    if (res.status === 'fulfilled') {
      console.log(res.value);
    } else {
      console.error('Error:', res.reason);
    }
  });
}

generatePrismaClient();
