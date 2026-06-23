const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    fs.statSync(p).isDirectory() ? walkDir(p, callback) : callback(p);
  });
}

walkDir(path.join(__dirname, 'src', 'modules'), (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace req.user!.libraryId with (req.user!.libraryId as string)
    // Only replace if it doesn't already have as string
    content = content.replace(/req\.user!\.libraryId(?! as string)/g, '(req.user!.libraryId as string)');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

let authPath = path.join(__dirname, 'src', 'middleware', 'authenticate.ts');
let authContent = fs.readFileSync(authPath, 'utf8');
authContent = authContent.replace(/const token = authHeader\.split\(' '\)\[1\];/, "const token = authHeader.split(' ')[1] as string;");
fs.writeFileSync(authPath, authContent, 'utf8');

console.log('Final TS fix complete');
