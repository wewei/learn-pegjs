import { generate } from 'pegjs';
import path from 'path';
import fs from 'fs-extra';

Promise.all([
  fs.readFile(path.resolve(__dirname, '../syntax/DPD.pegjs'), 'utf8'),
  fs.readFile(path.resolve(__dirname, '../test/test.dpd'), 'utf8'),
])
  .then(([syntax, text]) => generate(syntax).parse(text))
  .then((obj) => JSON.stringify(obj, null, 2))
  .then(console.log);
