import fs from 'fs';

export function checkRepoPermissions(dir) {
  try {
    fs.accessSync(dir, fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch { return false; }
}
