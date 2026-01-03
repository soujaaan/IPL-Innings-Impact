
import Papa from "papaparse";
import { InningsData } from "./types";

/**
 * Loads and parses the innings impact data from the CSV file.
 * Uses native fetch for better error reporting and compatibility 
 * with various hosting environments.
 */
export async function loadInningsData(): Promise<InningsData[]> {
  // We use a simple relative path. In standard deployments, 
  // the file at public/innings_impact.csv is served at /innings_impact.csv
  const csvPath = "innings_impact.csv";

  try {
    console.log(`[Data Service] Attempting to fetch: ${csvPath}`);
    
    const response = await fetch(csvPath);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const csvString = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Filter to ensure data integrity
          const validRows = results.data.filter(
            (row: any) => 
              row && 
              row.match_id !== undefined && 
              row.match_id !== null && 
              !isNaN(Number(row.runs))
          );
          
          console.log(`[Data Service] Parsed ${validRows.length} valid innings.`);
          resolve(validRows as InningsData[]);
        },
        error: (err: any) => {
          console.error("[Data Service] PapaParse error:", err);
          reject(err);
        },
      });
    });
  } catch (err) {
    console.error("[Data Service] Fetch failed. Check if innings_impact.csv exists in the root/public directory.");
    throw err;
  }
}
