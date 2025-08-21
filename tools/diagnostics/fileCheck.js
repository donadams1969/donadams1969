import fs from 'fs';
import path from 'path';

export function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

export function verifyFileReadable(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch { return false; }
}

export function getCanonicalPath(filePath) {
  return path.resolve(filePath);
}
