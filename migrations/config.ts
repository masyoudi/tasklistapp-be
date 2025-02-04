import { writeFileSync } from 'node:fs';
import process from 'node:process';
import { db } from '@@/config';

const config = {
  dbuser: db.user,
  dbpassword: db.password,
  dbhost: db.host,
  dbport: Number(db.port),
  dbname: db.name,
};

try {
  const file = process.cwd().concat('/migrations/db.config.json');
  writeFileSync(file, JSON.stringify(config, null, 2));
}
catch {
  console.error('Failed to create config file migration');
}
