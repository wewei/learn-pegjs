import { generate } from 'pegjs';
import path from 'path';
import fs from 'fs-extra';

fs.readFile(path.resolve(__dirname, '../syntax/parser.pegjs'), 'utf8')
  .then((value) => generate(value))
  .then((parser) => parser.parse('1+ 2 +3'))
  .then(console.log);
