# Introduction

[![JSR Version](https://jsr.io/badges/@psych/sheet)](https://jsr.io/@psych/sheet) [![JSR Scope](https://jsr.io/badges/@psych)](https://jsr.io/@psych) [![JSR Score](https://jsr.io/badges/@psych/sheet/score)](https://jsr.io/@psych/sheet/score)

**PsychSheet** is a TypeScript library for parsing any data files into a universal format. It can be used to parse `.csv`, `.xlsx`, `.sav`, `.parquet`, `.dta`, `.numbers`, etc., into a json object array. And export the data to `.csv`, `.xlsx`, `.numbers`, etc.

- PsychSheet can be used in all modern JavaScript/TypeScript environments, including browsers, Node.js, Deno, and Bun.
- PsychSheet mainly based on [SheetJS](https://sheetjs.com/), but added more file formats for psychological and educational research.
- For use cases, please refer to my another project [PsychPen](https://github.com/LeafYeeXYZ/PsychPen).

**For full documentation and supported file formats, see <https://jsr.io/@psych/sheet/doc>.**

- [Introduction](#introduction)
- [Qiuck Start](#qiuck-start)
  - [Installation](#installation)
  - [Use in Browser](#use-in-browser)
  - [Use in Deno/Node/Bun](#use-in-denonodebun)
- [Development](#development)

# Qiuck Start

## Installation

```bash
npx jsr add @psych/sheet # if using npm
bunx jsr add @psych/sheet # if using bun
deno add jsr:@psych/sheet # if using deno
pnpm dlx jsr add @psych/sheet # if using pnpm
yarn dlx jsr add @psych/sheet # if using yarn
```

## Use in Browser

```typescript
import { importSheet, downloadSheet } from '@psych/sheet'
const file = document.getElementById('file')
file.addEventListener('change', async () => {
  const data = await importSheet(await file.files[0].arrayBuffer(), 'xlsx')
  console.log(data[0], data.length)
  downloadSheet(data, 'csv', 'example')
})
```

## Use in Deno/Node/Bun

```typescript
import { importSheet, exportSheet } from '@psych/sheet'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const filepath = resolve(import.meta.dirname!, 'example.xlsx')
const file = await readFile(filepath)
const data = await importSheet(file, 'xlsx')
console.log(data[0], data.length)
await writeFile(resolve(import.meta.dirname!, 'example.csv'), exportSheet(data, 'csv'))
```

**For full documentation and supported file formats, see <https://jsr.io/@psych/sheet/doc>.**

# Development

- `sav` file format is supported by <https://github.com/mhermher/savvy>, but it doesn't work directly in Deno. So I have to download the `savvy` source code and modify it to make it work in this project. The modified source code is in the `/lib/sav` folder.
- `parquet` file format is supported by <https://github.com/hyparam/hyparquet>.
- `dta`、`xlsx`、`numbers` file formats are supported by <https://sheetjs.com/>. But `JSR` doesn't support importing modules from third-party URLs, so I have to download the source code and import them locally. You can find the source code in the `/lib/xlsx` folder.

If you haven't installed `deno` yet, please install it referring to the <https://deno.com>. Then, clone this repository.

```bash
git clone https://github.com/LeafYeeXYZ/PsychSheet.git
```

Now you can write `TypeScript` code in `/lib/**/*.ts` and export functions in `/lib/index.ts`. Note that you should not import base functions from `/lib/index.ts` to avoid circular dependencies.

After writing the code, remember to add test cases in `/tests/*.test.ts`. You can run the test cases using the following command.

```bash
deno test -A
```

This project publishes to <https://jsr.io>, so you don't need to compile the code to JavaScript. And you also don't need to publish the package manually. Just modify `deno.json` and push the code to the repository. The `GitHub Action` will do the rest for you.
