import { importSheet, exportSheet } from '../lib/main.ts'
import { assertEquals } from 'jsr:@std/assert'
import { readFile, writeFile, unlink } from 'node:fs/promises'
import { resolve } from 'node:path'

const file = await readFile(resolve(import.meta.dirname!, 'demo.csv'))
const sheet = await importSheet(file, 'csv')

Deno.test('Import', async () => {
  assertEquals(sheet.length, 85)
  const xlsx = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.xlsx')), 'xlsx')
  const json = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.json')), 'json')
  const numbers = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.numbers')), 'numbers')
  const dta = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.dta')), 'dta')
  const sav = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.sav')), 'sav')
  const parquet = await importSheet(await readFile(resolve(import.meta.dirname!, 'demo.parquet')), 'parquet')
  console.log('xlsx:', xlsx[0], 'length:', xlsx.length)
  console.log('json:', json[0], 'length:', json.length)
  console.log('numbers:', numbers[0], 'length:', numbers.length)
  console.log('dta:', dta[0], 'length:', dta.length)
  console.log('sav:', sav[0], 'length:', sav.length)
  console.log('parquet:', parquet[0], 'length:', parquet.length)
})

Deno.test('Export', async () => {
  const json = exportSheet(sheet, 'json')
  const numbers = exportSheet(sheet, 'numbers')
  const xlsx = exportSheet(sheet, 'xlsx')
  const csv = exportSheet(sheet, 'csv')
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
