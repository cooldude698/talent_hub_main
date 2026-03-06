const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/Aman/Downloads/talent_hub_main-main/talent_hub_main-main/src';
const rootFiles = ['c:/Users/Aman/Downloads/talent_hub_main-main/talent_hub_main-main/index.html'];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace uppercase RAWGEN
    content = content.replace(/RAWGEN/g, 'RAWGENN');
    
    // Replace lowercase rawgen (for emails, domains, etc)
    content = content.replace(/rawgen/g, 'rawgenn');
    
    // Replace PascalCase if any
    content = content.replace(/Rawgen/g, 'Rawgenn');

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
            replaceInFile(fullPath);
        }
    }
}

processDirectory(directory);
for (const file of rootFiles) {
    if (fs.existsSync(file)) {
        replaceInFile(file);
    }
}
console.log("Replacement complete.");
