#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

const rootDir = path.resolve(__dirname, '..');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runCommand(cmd, args = [], options = {}) {
  const fullCmd = `${cmd} ${args.join(' ')}`;
  log(`\n$ ${fullCmd}`, 'blue');

  const { stdout, stderr } = await execPromise(fullCmd, {
    cwd: rootDir,
    ...options,
  });

  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
}

async function checkEnvFile() {
  const envPath = path.join(rootDir, '.env');
  const envExamplePath = path.join(rootDir, '.env.example');

  if (!fs.existsSync(envPath)) {
    log('\n⚠️  .env file not found. Creating from .env.example...', 'yellow');

    if (!fs.existsSync(envExamplePath)) {
      log('❌ .env.example not found!', 'red');
      process.exit(1);
    }

    fs.copyFileSync(envExamplePath, envPath);
    log('✅ .env file created', 'green');
  } else {
    log('✅ .env file already exists', 'green');
  }
}

async function waitForDocker() {
  log('\n⏳ Waiting for Docker services to be healthy...', 'yellow');
  
  const maxRetries = 30;
  const retryDelay = 2000; // 2 seconds
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Check if MySQL is healthy
      const checkMysql = async () => {
        try {
          await execPromise('docker exec chatbot-database_service-1 mysqladmin ping -h localhost');
          return true;
        } catch {
          return false;
        }
      };

      const mysqlHealthy = await checkMysql();

      if (mysqlHealthy) {
        log('✅ All Docker services are healthy', 'green');
        return;
      }

      retries++;
      if (retries < maxRetries) {
        process.stdout.write('.');
      }
      
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    } catch (error) {
      retries++;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  log('\n⚠️  Docker services did not become healthy within timeout. Proceeding anyway...', 'yellow');
}

async function main() {
  try {
    log('\n====================================', 'bright');
    log('   🚀 Chatbot Project Onboarding   ', 'bright');
    log('====================================\n', 'bright');

    // Step 1: Install dependencies
    log('📥 Step 1: Installing project dependencies...', 'bright');
    await runCommand('yarn', ['install']);
    log('✅ Dependencies installed successfully', 'green');

    // Step 2: Check and create .env file
    log('\n🔧 Step 2: Checking environment configuration...', 'bright');
    await checkEnvFile();

    // Step 3: Start Docker containers
    log('\n🐳 Step 3: Starting Docker services...', 'bright');
    await runCommand('yarn', ['docker:base-up']);
    log('✅ Docker services started', 'green');

    // Step 4: Wait for services to be healthy
    await waitForDocker();

    // Step 5: Install Ollama models
    log('\n🤖 Step 5: Installing Ollama models...', 'bright');
    await runCommand('yarn', ['ollama:install']);
    log('✅ Ollama models installed successfully', 'green');

    // Step 6: Generate Prisma client
    log('\n🔨 Step 6: Generating Prisma client...', 'bright');
    await runCommand('yarn', ['db:generate']);
    log('✅ Prisma client generated successfully', 'green');

    // Step 7: Run database migrations
    log('\n🗄️  Step 7: Running database migrations...', 'bright');
    await runCommand('yarn', ['db:migrate-dev']);
    log('✅ Database migrations completed', 'green');

    // Step 8: Seed the database
    log('\n🌱 Step 8: Seeding database...', 'bright');
    await runCommand('yarn', ['db:seed']);
    log('✅ Database seeded successfully', 'green');

    // Final success message
    log('\n====================================', 'bright');
    log('   ✅ Onboarding Complete!         ', 'bright');
    log('====================================\n', 'bright');

    log('Next steps:', 'bright');
    log('  • Run "yarn dev" to start development servers', 'yellow');
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
