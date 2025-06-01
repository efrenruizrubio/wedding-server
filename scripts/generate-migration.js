const { execSync } = require('child_process');
const path = require('path');
const chalk = require('chalk');

const currentDir = process.cwd();

const migrationPath = path.join(currentDir, 'src', 'database', 'migrations');

const name = process.argv[2];

if (!name) {
  console.error(chalk.red('Please provide a name for the migration.'));
  process.exit(1);
}

const finalMigrationPath = `${migrationPath}/${name}`;

console.info(chalk.green(`Generating migration at ${finalMigrationPath}`));

try {
  const result = execSync(
    `typeorm-ts-node-commonjs -d ormconfig.ts migration:generate ${finalMigrationPath}`,
  );
  console.log(chalk.blue('Output: '));

  console.info(result.toString());
  console.log(
    chalk.green('\nMigration generated successfully at'),
    chalk.cyan(finalMigrationPath),
  );
} catch (error) {
  console.error(chalk.red(`Error generating migration: ${error.message}`));
  console.error(chalk.yellow('Command output:'));
  process.exit(1);
}