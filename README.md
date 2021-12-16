# Lines of Code Calculator

## Table of Contents

- [Dependencies](#markdown-header-dependencies)
- [How to install](#markdown-header-how-to-install)
- [Usage](#markdown-header-usage)

## Dependencies

Node.js
NPM

## How to install

### 1. Clone the repository

```bash
git clone https://github.com/km2795/Loccal.git
```

### 2. Get inside the cloned repository

```bash
cd Loccal
```

### 3. Checkout the main branch, if it's not already.

```bash
git checkout main
```

### 4. Install dependencies

```bash
npm install
```

### 5. Run tests

```bash
npm test
```

### 6. Build the code.

```bash
# Clean any previous build artifacts created.
npm run clean
npm run build
```

### 7. Finally run the tool.

> `RUN 'npm run build' FIRST BEFORE RUNNING THE CODE.`

```bash
node loc ./
```

Calculate LOC for the current directory.

## Usage

### 0. Basic command 

```bash
node loc <file/dir path>
```

### 1. For a single file.

```bash
node loc file.ext
```

### 2. For multiple specific files.

```bash
node loc file1.a,file2.b,file3.c....
```

### 3 For a directory (without sub-directories)

```bash
node loc dir_path
```

> `Without -r option, if the directory contains only sub-directories, then the calculator will calculate nothing.`

### 4. For a directory (with sub-directories)

```bash
node loc -r dir_path
```

-r for recursively selecting files in the sub-directories too.

### 5. For excluding specific files.

> These files won't be analyzed for LOC if found in the directory or sub-directory.

```bash
node loc -exf file1,file2,file3... main_dir_path
```

### 6. For excluding specific directories.

> These directories if found inside the main directory or sub-directories, won't be traversed.

```bash
node loc -exd dir1,dir2,dir3... main_dir_path
```

### 7. For excluding specific file extensions.

> Files with these extensions won't be included in calculation.

```bash
node loc -ex ext1,ext2,ext3,... main_dir_path
```

> `Optional to precede the extensions with a (.) period.`

### 8. For selected extensions only.

```bash
node loc -ae ext1,ext2,ext3,... main_dir_path
```

> `Optional to precede the extensions with a (.) period.`
> `Only files with matching extension will be included.`

### 9. Ignore comments (multi and single line both).

```bash
node loc -c file/dir_path.
```

### 10. Ignore comments (multi and single line both) and empty lines.

```bash
node loc -oc file/dir_path
```

### 11. Show more information

```bash
node loc -v file/dir_path
```

### 12. Show help

```bash
node loc -h
```

### 13. Some example commands

```bash
# Remove any empty lines or comments
# Exclude directories node_modules/, build/
# Exclude file 'package-lock.json'
# Exclude extensions .txt, .md
# Search directory recursively.
# Display more details.
# Target directory: Current directory.
node loc -v -r -oc -exd node_modules,build -exf package-lock.json -ex .txt,.md ./
```

```bash
# Remove any empty lines and comments.
# Search directory recursively.
# Display more details.
# Target directory: 'project-todo-java'
node loc -v -r -oc ../project-todo-java
```

```bash
# Only search files with extension '.js'
# Just the parent directory not recursively.
# Target directory: Current directory.
node loc -ae .js ./
```
