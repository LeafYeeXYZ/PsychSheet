import { parquetRead } from 'npm:hyparquet@1.5.0'
import { SavParser, Feeder } from './sav/main.ts'
// @ts-types='./xlsx/xlsx.d.ts'
import { read, utils, write } from './xlsx/xlsx.ts'
import { parse, set_utils } from './xlsx/dta.ts'
import { XLSX_ZAHL_PAYLOAD } from './xlsx/numbers.ts'

/**
 * The supported file types for importing data.
 */
export enum ImportTypes {
  XLS = 'xls',
  XLSX = 'xlsx',
  CSV = 'csv',
  TXT = 'txt',
  JSON = 'json',
  NUMBERS = 'numbers',
  DTA = 'dta',
  SAV = 'sav',
  PARQUET = 'parquet'
}

/**
 * The supported file types for exporting data.
 */
export enum ExportTypes {
  XLSX = 'xlsx',
  CSV = 'csv',
  NUMBERS = 'numbers',
  JSON = 'json'
}

/**
 * Export data to a file.
 * @param sheet The data to export.
 * @param type The type of the file.
 * @param filename The name of the file without the extension (default: 'PsychSheet').
 * @returns The exported data.
 */
export function exportSheet(
  sheet: { [key: string]: unknown }[], 
  type: ExportTypes, 
  filename: string = 'PsychSheet'
): Uint8Array {
  if (type === ExportTypes.JSON) {
    return new TextEncoder().encode(JSON.stringify(sheet, null, 2))
  }
  const worksheet = utils.json_to_sheet(sheet)
  const workbook = utils.book_new(worksheet, filename + type)
  return new Uint8Array(write(workbook, { type: 'array', bookType: type, numbers: XLSX_ZAHL_PAYLOAD }))
}

/**
 * Download data as a file. Only works in the browser.
 * @param sheet The data to download.
 * @param type The type of the file.
 * @param filename The name of the file without the extension (default: 'PsychSheet').
 * @throws {Error} Only works in the browser.
 */
export function downloadSheet(
  sheet: { [key: string]: unknown }[], 
  type: ExportTypes, 
  filename: string = 'PsychSheet'
): void {
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
 * @param type The type of the file.
 * @returns The imported data.
 */
export async function importSheet<T = { [key: string]: unknown }>(
  file: ArrayBuffer, 
  type: ImportTypes
): Promise<T[]> {
  if (!(file instanceof ArrayBuffer)) {
    file = new Uint8Array(file).buffer
  }
  switch (type) {
    case ImportTypes.DTA: {
      set_utils(utils)
      const workbook = await parse(new Uint8Array(file))
      return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as T[]
    }
    case ImportTypes.SAV: {
      const parser = new SavParser()
      const feeder = new Feeder(file)
      //@ts-expect-error it actually exists
      return (await parser.all(feeder)).rows.map((map: Map<string, unknown>) => Object.fromEntries(map))
    }
    case ImportTypes.PARQUET: {
      let rows: T[] = []
      await parquetRead({
        file,
        rowFormat: 'object',
        onComplete: (data) => {
          const workbook = utils.book_new(utils.json_to_sheet(data), 'psychsheet')
          rows = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as T[]
        }
      })
      return rows
    }
    case ImportTypes.CSV:
    case ImportTypes.TXT: {
      // Sheet.js default encoding is utf-16
      const text = new TextDecoder('utf-8').decode(file)
      const workbook = read(text, { type: 'string' })
      return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as T[]
    }
    case ImportTypes.JSON: {
      return JSON.parse(new TextDecoder().decode(file))
    }
    default: {
      const workbook = read(file)
      return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as T[]
    }
  }
}
