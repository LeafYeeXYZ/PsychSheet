import { importSheet, exportSheet, ImportTypes, ExportTypes } from '../lib/main.ts'
import { assertEquals } from 'jsr:@std/assert'
import { readFile, writeFile, unlink } from 'node:fs/promises'
import { resolve } from 'node:path'

const file = await readFile(resolve(import.meta.dirname!, 'demo.csv'))
const sheet = await importSheet(file, ImportTypes.CSV)

Deno.test('Import', async () => {
  assertEquals(sheet.length, 85)
  const xlsx = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.xlsx')), ImportTypes.XLSX)
  const json = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.json')), ImportTypes.JSON)
  const numbers = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.numbers')), ImportTypes.NUMBERS)
  const dta = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.dta')), ImportTypes.DTA)
  const sav = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.sav')), ImportTypes.SAV)
  const parquet = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.parquet')), ImportTypes.PARQUET)
  assertEquals(xlsx instanceof Array, true)
  assertEquals(json instanceof Array, true)
  assertEquals(numbers instanceof Array, true)
  assertEquals(dta instanceof Array, true)
  assertEquals(sav instanceof Array, true)
  assertEquals(parquet instanceof Array, true)
  assertEquals(xlsx[0] instanceof Object, true)
  assertEquals(json[0] instanceof Object, true)
  assertEquals(numbers[0] instanceof Object, true)
  assertEquals(dta[0] instanceof Object, true)
  assertEquals(sav[0] instanceof Object, true)
  assertEquals(parquet[0] instanceof Object, true)
  // console.log('xlsx:', xlsx[0], 'length:', xlsx.length)
  // console.log('json:', json[0], 'length:', json.length)
  // console.log('numbers:', numbers[0], 'length:', numbers.length)
  // console.log('dta:', dta[0], 'length:', dta.length)
  // console.log('sav:', sav[0], 'length:', sav.length)
  // console.log('parquet:', parquet[0], 'length:', parquet.length)
})

Deno.test('Export', async () => {
  const json = exportSheet(sheet, ExportTypes.JSON)
  const numbers = exportSheet(sheet, ExportTypes.NUMBERS)
  const xlsx = exportSheet(sheet, ExportTypes.XLSX)
  const csv = exportSheet(sheet, ExportTypes.CSV)
  const exportName = 'PsychSheet_Export'
  await writeFile(resolve(import.meta.dirname!, `${exportName}.json`), json)
  await writeFile(resolve(import.meta.dirname!, `${exportName}.numbers`), numbers)
  await writeFile(resolve(import.meta.dirname!, `${exportName}.xlsx`), xlsx)
  await writeFile(resolve(import.meta.dirname!, `${exportName}.csv`), csv)
  assertEquals(json instanceof Uint8Array, true)
  assertEquals(numbers instanceof Uint8Array, true)
  assertEquals(xlsx instanceof Uint8Array, true)
  assertEquals(csv instanceof Uint8Array, true)
  // Delete the files
  await unlink(resolve(import.meta.dirname!, `${exportName}.json`))
  await unlink(resolve(import.meta.dirname!, `${exportName}.numbers`))
  await unlink(resolve(import.meta.dirname!, `${exportName}.xlsx`))
  await unlink(resolve(import.meta.dirname!, `${exportName}.csv`))
})
