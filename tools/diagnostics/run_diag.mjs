import { checkFileExists, verifyFileReadable, getCanonicalPath } from './fileCheck.js';
import { checkRepoPermissions } from './envCheck.js';

const fileToFind = "services/valorai2e/app/main.py";
const repoDir = "./";

console.log(`--- Running Diagnostics ---`);
console.log(`Checking for file: ${fileToFind}`);
const exists = checkFileExists(fileToFind);
console.log(`Result (exists): ${exists}`);

if (exists) {
    console.log(`Checking if file is readable...`);
    const readable = verifyFileReadable(fileToFind);
    console.log(`Result (readable): ${readable}`);
    const canonicalPath = getCanonicalPath(fileToFind);
    console.log(`Canonical path: ${canonicalPath}`);
}

console.log(`Checking repo permissions for: '${repoDir}'`);
const perms = checkRepoPermissions(repoDir);
console.log(`Result (permissions OK): ${perms}`);
console.log(`--- Diagnostics Complete ---`);
