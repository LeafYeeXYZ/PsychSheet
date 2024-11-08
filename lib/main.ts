import { SavParser, Feeder } from 'jsr:@leaf/sav-reader@0.0.1'
import { parquetRead } from 'npm:hyparquet@1.5.0'
import { read, utils, write } from './xlsx.js'
import { parse, set_utils } from './dta.js'
import { XLSX_ZAHL_PAYLOAD } from './numbers.ts'

/**
 * The supported file types for importing data.
 */
export type ImportTypes = 'xls' | 'xlsx' | 'csv' | 'txt' | 'json' | 'numbers' | 'dta' | 'sav' | 'parquet'
/**
 * The supported file types for exporting data.
 */
export type ExportTypes = 'xlsx' | 'csv' | 'numbers' | 'json'
/**
 * A row of data in the sheet.
 */
export type Row = { [key: string]: unknown }
/**
 * Export data to a file.
 * @param sheet The data to export.
 * @param type The type of the file (e.g., 'xlsx', 'csv', 'json').
 * @param filename The name of the file without the extension (default: 'PsychSheet').
 * @returns The exported data.
 */
export function exportSheet(sheet: Row[], type: ExportTypes, filename: string = 'PsychSheet'): Uint8Array {
  if (type === 'json') {
    return new TextEncoder().encode(JSON.stringify(sheet, null, 2))
  }
  const worksheet = utils.json_to_sheet(sheet)
  const workbook = utils.book_new(worksheet, filename + type)
  return new Uint8Array(write(workbook, { type: 'array', bookType: type, numbers: XLSX_ZAHL_PAYLOAD }))
}
/**
 * Download data as a file. Only works in the browser.
 * @param sheet The data to download.
 * @param type The type of the file (e.g., 'xlsx', 'csv', 'json').
 * @param filename The name of the file without the extension (default: 'PsychSheet').
 * @throws {Error} Only works in the browser.
 */
export function downloadSheet(sheet: Row[], type: ExportTypes, filename: string = 'PsychSheet'): void {
  // @ts-ignore In Browser
  // deno-lint-ignore no-window
  if (!window?.document) {
    throw new Error('Not supported in this environment, use exportSheet() and manually save the file')
  }
  const file = exportSheet(sheet, type, filename)
  const blob = new Blob([file], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  // @ts-ignore In Browser
  const a = document.createElement('a')
  a.href = url
  a.download = filename + '.' + type
  a.click()
}
/**
 * Import data from a file.
 * @param file The file to import.
 * @param type The type of the file (e.g., 'xlsx', 'csv', 'json').
 * @returns The imported data.
 */
export async function importSheet(file: ArrayBuffer, type: ImportTypes): Promise<Row[]> {
  if (!(file instanceof ArrayBuffer)) {
    file = new Uint8Array(file).buffer
  }
  switch (type) {
    case 'dta': {
      set_utils(utils)
      const workbook = await parse(new Uint8Array(file))
      return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    }
    case 'sav': {
      const parser = new SavParser()
      const feeder = new Feeder(file)
      return (await parser.all(feeder)).rows.map((map: Map<string, unknown>) => Object.fromEntries(map))
    }
    case 'parquet': {
      let rows: Row[] = []
      await parquetRead({
        file,
        rowFormat: 'object',
        onComplete: (data) => {
          const workbook = utils.book_new(utils.json_to_sheet(data), 'psychsheet')
          rows = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
        }
      })
      return rows
    }
    case 'txt': {
      // Sheet.js default encoding is utf-16
      const text = new TextDecoder('utf-8').decode(file)
      const workbook = read(text, { type: 'string' })
      return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    }
    case 'json': {
      return JSON.parse(new TextDecoder().decode(file))
    }
    default: {
      const workbook = read(file)
      return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    }
  }
}
