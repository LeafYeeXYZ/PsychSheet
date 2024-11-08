/**
 * @module @psych/sheet
 * @description **PsychSheet** is a TypeScript library for parsing any data files into a universal format. It can be used to parse `.csv`, `.xlsx`, `.sav`, `.json`, `.parquet`, `.dta`, `.numbers`, etc., into a json object array. And export the data to `.csv`, `.xlsx`, `.numbers`, etc.
 * @example Quick Start - Browser
 * ```typescript
 * import { importSheet, downloadSheet } from '@psych/sheet'
 * const file = document.getElementById('file')
 * file.addEventListener('change', async () => {
 *   const data = await importSheet(await file.files[0].arrayBuffer(), 'xlsx')
 *   console.log(data[0], data.length)
 *   downloadSheet(data, 'csv', 'example')
 * })
 * ```
 * @example Quick Start - Deno/Node/Bun
 * ```typescript
 * import { importSheet, exportSheet } from '@psych/sheet'
 * import { readFile, writeFile } from 'node:fs/promises'
 * import { resolve } from 'node:path'
 * const filepath = resolve(import.meta.dirname!, 'example.xlsx')
 * const file = await readFile(filepath)
 * const data = await importSheet(file, 'xlsx')
 * console.log(data[0], data.length)
 * await writeFile(resolve(import.meta.dirname!, 'example.csv'), exportSheet(data, 'csv'))
 * ```
 */

export * from './main.ts'
