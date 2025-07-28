#!/usr/bin/env node

const { execSync } = require('child_process');

const run = (cmd) => {
  try {
    console.log(`\n> ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Failed: ${cmd}`);
    process.exit(1);
  }
};

const help = () => {
  console.log(`
📦 Sequelize DB Helper CLI

Usage:
  npm run db <command> [...args]

Commands:
  create                  Create the database
  drop                    Drop the database
  reset                   Drop, create, migrate, and seed

  migrate                 Run all migrations
  migrate:undo            Undo last migration
  migrate:undo:all        Undo all migrations
  migration:create <name> Generate a new migration file

  seed                    Run all seeders
  seed:undo               Undo all seeders
  seeder:create <name>    Generate a new seeder file

  model:create <name> --attributes attr:type,...
                          Generate a new model and migration

Examples:
  npm run db create
  npm run db reset
  npm run db migration:create add-user-status
  npm run db model:create User --attributes name:string,email:string
`);
};

const args = process.argv.slice(2);
const [cmd, ...rest] = args;

switch (cmd) {
  case 'create':
    run('npx sequelize-cli db:create');
    break;
  case 'drop':
    run('npx sequelize-cli db:drop');
    break;
  case 'reset':
    run('npx sequelize-cli db:drop');
    run('npx sequelize-cli db:create');
    run('npx sequelize-cli db:migrate');
    run('npx sequelize-cli db:seed:all');
    break;

  case 'migrate':
    run('npx sequelize-cli db:migrate');
    break;
  case 'migrate:undo':
    run('npx sequelize-cli db:migrate:undo');
    break;
  case 'migrate:undo:all':
    run('npx sequelize-cli db:migrate:undo:all');
    break;
  case 'migration:create':
    if (!rest[0]) return help();
    run(`npx sequelize-cli migration:generate --name ${rest[0]}`);
    break;

  case 'seed':
    run('npx sequelize-cli db:seed:all');
    break;
  case 'seed:undo':
    run('npx sequelize-cli db:seed:undo:all');
    break;
  case 'seeder:create':
    if (!rest[0]) return help();
    run(`npx sequelize-cli seed:generate --name ${rest[0]}`);
    break;

  case 'model:create':
    if (!rest[0]) return help();
    run(`npx sequelize-cli model:generate ${rest.join(' ')}`);
    break;

  default:
    help();
}
