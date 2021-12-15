# ISSUES

## #1 Ctrl + C has no effect, if the directory has a lot of files

## #2 No mechanism to handle big files

## #3 parseInput() will skip arguments where there is a space after comma (,)

> e.g., node loc -v -r -exd node_modules, .git ./
<br />
Here, the '.git' folder will not be EXCLUDED.

## #4 Recursive lookup will not work in case of thousands of folders, inside a single folder
