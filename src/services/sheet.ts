import Papa from "papaparse"

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR4Jf6eOcGsbnRYIPVP60JVWDp1KkqZMGdcj3t8ABR9hdaFY9t3bLcvqgVjTVWVtz9GFUDtWADB_iLx/pub?output=csv"

export async function getSheetData() {

  const res = await fetch(SHEET_URL, {
    next: { revalidate: 3600 } // refresh every hour
  })

  const csv = await res.text()

  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true
  })

  return data
}