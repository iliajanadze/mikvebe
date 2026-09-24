import { JSDOM } from 'jsdom';
import fs from 'fs';

const html = fs.readFileSync('./dist/index.html', 'utf8');
console.log('Dist html length:', html.length);
