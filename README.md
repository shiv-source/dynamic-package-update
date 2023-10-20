# dynamic-package-update

![NPM Version](https://img.shields.io/npm/v/dynamic-package-update.svg?style=flat)
![NPM Downloads](https://img.shields.io/npm/dm/dynamic-package-update.svg)
![GitHub release](https://img.shields.io/github/release/shiv-source/dynamic-package-update)
![License](https://img.shields.io/github/license/shiv-source/dynamic-package-update)

A simple node.js module for dynamic updating packages list in the markdown file.


# Installation

## Prerequisites

- Node.js >= 10.0.0


## Install Package

```sh

# With NPM

npm install --save dynamic-package-update

# With Yarn

yarn add dynamic-package-update

```

```js
// Available options

const dpu = require("dynamic-package-update");

const option = {
    outPutFileName: 'docs.md',              // Default is README.md
    packageJsonFile: 'your json file',      // Default your root package.json file no need to set this option. 
    showNpmLinkColumn: true,                // Default is true.
    showTypeColumn: true,                   // Default is true.
    showDependencies: true,                 // Default is true.
    showDevDependencies: true               // Default is true.
}

// Note: By default option is an optional parameter.

dpu.generateTableMarkDown(readmefile, option);
```

# Examples

Create a readme.js file for updating README.md file.

```
Folder structure with readme.js:

    +-- node_modules
    +-- src
    |   +-- index.js
    |   +-- file1.js
    |   +-- file1.js
    +-- package.json
    +-- package-lock.json
    +-- readme.js
    +-- README.md

```

```js
// readme.js

const dpu = require("dynamic-package-update");
const fs = require('fs');
const path = require('path');

const readmefile = fs.readFileSync(path.join(__dirname, "README.md"), "utf8");
dpu.generateTableMarkDown(readmefile);

```

```
Notes:
- Add this below html code in anywhere in your README.md file.
- Don't add anything inside this content div.
- It will automatically inject package list from your package.json file.
- Along with package list, It will automatically add  Package List as a title tag. Don't add it explicitely.

```

```html
<!--README.md-->

<div id="content">
</div>
```

```js
// package.json

  "scripts": {
    "start": "node src/index.js",
    "readme:dpu": "node readme.js"
  },

```

```sh

npm run readme:dpu     #This will automatically update package list in the README.md file

```

# Package Insights

## Build

```sh
npm install             #For installing dependencies

npm build               #For making build
```

<div id="content">

## Package List

 | Package Name | Version | Type | Npm Link |
 | ---- | ---- | ---- | ---- | 
 | @types/node | ^20.8.7 | devDependencies | [@types/node](https://www.npmjs.com/package/@types/node) | 
 | lint-staged | ^15.0.2 | devDependencies | [lint-staged](https://www.npmjs.com/package/lint-staged) | 
 | prettier | ^3.0.3 | devDependencies | [prettier](https://www.npmjs.com/package/prettier) | 
 | typescript | ^5.2.2 | devDependencies | [typescript](https://www.npmjs.com/package/typescript) | 
 | husky | ^8.0.0 | devDependencies | [husky](https://www.npmjs.com/package/husky) | 

</div>


```sh
Note: The build artifacts will be stored in the `dist/` directory.
```

# Contributors

<a href = "https://github.com/shiv-source">
  <img 
    src = "https://avatars.githubusercontent.com/u/56552766?v=4" 
    width="100" 
    height="100"
    style="border-radius: 50%; margin: 5px;" 
  />
</a>

# License

[MIT](https://opensource.org/licenses/MIT)

**Free Software**