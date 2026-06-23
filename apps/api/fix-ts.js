const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchRegex, replaceString) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(searchRegex, replaceString);
  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src', 'modules'), (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/req\.user\?\.libraryId/g, 'req.user!.libraryId');
    content = content.replace(/req\.user\?\.id/g, 'req.user!.id');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

replaceInFile(
  path.join(__dirname, 'src', 'middleware', 'authenticate.ts'),
  /req\.user\?\.id/g,
  'req.user!.id'
);

replaceInFile(
  path.join(__dirname, 'src', 'modules', 'seats', 'seats.repository.ts'),
  /tx: any/g,
  'tx: any'
);
let seatsRepoPath = path.join(__dirname, 'src', 'modules', 'seats', 'seats.repository.ts');
let seatsRepoContent = fs.readFileSync(seatsRepoPath, 'utf8');
seatsRepoContent = seatsRepoContent.replace(/tx =>/g, '(tx: any) =>');
fs.writeFileSync(seatsRepoPath, seatsRepoContent, 'utf8');

let jwtPath = path.join(__dirname, 'src', 'utils', 'jwt.ts');
let jwtContent = fs.readFileSync(jwtPath, 'utf8');
jwtContent = jwtContent.replace(/process\.env\.JWT_SECRET \|\| 'secret'/g, '(process.env.JWT_SECRET || "secret") as string');
jwtContent = jwtContent.replace(/process\.env\.JWT_REFRESH_SECRET \|\| 'refresh_secret'/g, '(process.env.JWT_REFRESH_SECRET || "refresh_secret") as string');
fs.writeFileSync(jwtPath, jwtContent, 'utf8');

console.log('Fixed TS errors');
