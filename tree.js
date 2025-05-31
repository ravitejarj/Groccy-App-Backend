const fs = require('fs');
const path = require('path');

function printTree(dirPath, indent = '') {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    if (item === 'node_modules') continue; // Skip node_modules

    const fullPath = path.join(dirPath, item);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    console.log(indent + (isDirectory ? '📁 ' : '📄 ') + item);

    if (isDirectory) {
      printTree(fullPath, indent + '│   ');
    }
  }
}

// Start from current directory
printTree(process.cwd());
