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
    content = content.replace(/req\.user!\.libraryId/g, '(req.user!.libraryId as string)');
    content = content.replace(/req\.user!\.id/g, '(req.user!.id as string)');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

replaceInFile(
  path.join(__dirname, 'src', 'middleware', 'authenticate.ts'),
  /req\.user!\.id/g,
  '(req.user!.id as string)'
);

console.log('Fixed TS casting errors');
