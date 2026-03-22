const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = ['node_modules', '.git'];
const ERROR_MD_CONTENT = '# Error Log\n\nNo errors reported in this directory.\n';

function createErrorMdInAllFolders(dir) {
    // Create error.md in the current directory
    const errorFilePath = path.join(dir, 'error.md');
    if (!fs.existsSync(errorFilePath)) {
        fs.writeFileSync(errorFilePath, ERROR_MD_CONTENT, 'utf8');
        console.log(`Created: ${errorFilePath}`);
    }

    // Read contents of the directory and traverse recursively
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        
        // Check if it is a directory and not in the ignore list
        if (fs.statSync(fullPath).isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                createErrorMdInAllFolders(fullPath);
            }
        }
    }
}

createErrorMdInAllFolders(__dirname);
console.log("Finished generating error.md files across all folders.");