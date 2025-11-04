/**
 * Turkish Name Gender Classifier and Salutation Generator
 * This version reads the name-gender pairs from a sheet named "NamesDatabase"
 * and uses a cache for high-speed performance.
 */

// -----------------------------------------------------------------
// FUNCTION 1: Gets the names database (No Cache Version)
// -----------------------------------------------------------------
function getNamesDatabase() {
  Logger.log("Reading names directly from 'NamesDatabase' sheet...");
  
  // 1. Read from the "NamesDatabase" sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const nameSheet = ss.getSheetByName("NamesDatabase");
  if (!nameSheet) { 
    Logger.log("Error: 'NamesDatabase' sheet not found."); 
    return {}; // Return an empty object
  }

  // Check if the sheet is empty (has no rows)
  const lastRow = nameSheet.getLastRow();
  if (lastRow === 0) {
    Logger.log("'NamesDatabase' sheet is empty. Returning empty object.");
    return {}; // Return an empty database
  }

  // Now it's safe to get the range
  const nameData = nameSheet.getRange("A1:B" + lastRow).getValues();
  
  const namesDB = {};
  // 2. Build the object
  for (let i = 0; i < nameData.length; i++) {
    const name = nameData[i][0]; // Name from Col A
    const gender = nameData[i][1]; // Gender from Col B
    if (name && gender) {
      namesDB[name.toLowerCase().trim()] = gender.toUpperCase().trim();
    }
  }
  
  // 3. Return the new list (no caching)
  return namesDB;
}

// -----------------------------------------------------------------
// FUNCTION 2: Classifies gender based on the database
// -----------------------------------------------------------------
function TURKISHGENDER(name, db) { // <-- NOW ACCEPTS THE DATABASE
  if (!name) return "U";
  
  // Get the names database (from sheet or cache)
  // const TURKISH_NAMES_DB = getNamesDatabase(); // <-- DELETED THIS LINE

  let cleanName = String(name).trim().toLowerCase();
  
  if (cleanName.includes(' ')) {
    cleanName = cleanName.split(' ')[0];
  }
  
  // Check database first
  if (db[cleanName]) { // <-- USES THE 'db' ARGUMENT
    return db[cleanName]; // <-- USES THE 'db' ARGUMENT
  }
  
  // Pattern-based classification (fallback)
  if (cleanName.match(/(gül|nur|nil|sel|mel|yel|fil)$/)) return "F";
  if (cleanName.endsWith("a") && !cleanName.match(/(afa|aha|sta)$/)) return "F";
  if (cleanName.match(/(ın|in|ün|un)$/)) return "F";
  if (cleanName.match(/(han|kan|tan|man)$/) && cleanName.length > 4) return "M";
  if (cleanName.match(/(er|ur|ır|ar)$/) && cleanName.length > 3) return "M";
  
  return "U";
}

// -----------------------------------------------------------------
// FUNCTION 3: The main function you run from the menu
// -----------------------------------------------------------------
function addSalutations() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const ui = SpreadsheetApp.getUi();
  
  // --- START OF NEW CODE ---
  // Read the database ONCE at the very beginning.
  ui.alert('Reading your "NamesDatabase"... This may take a moment.');
  const namesDB = getNamesDatabase();
  ui.alert('Database loaded. Now processing your contacts...');
  // --- END OF NEW CODE ---

  const selection = sheet.getActiveRange();
  if (!selection) {
    ui.alert('Please select the column with names first!');
    return;
  }
  
  const startRow = selection.getRow();
  const column = selection.getColumn();
  const numRows = selection.getNumRows();
  
  const names = sheet.getRange(startRow, column, numRows, 1).getValues();
  const hasHeader = isNaN(names[0][0]) && names[0][0] !== '';
  const salutations = [];
  let stats = {Bey: 0, Hanim: 0, U: 0};
  
  const startIndex = hasHeader ? 1 : 0; 
  
  for (let i = startIndex; i < names.length; i++) {
    const name = names[i][0];
    
    // --- THIS LINE IS CHANGED ---
    const gender = TURKISHGENDER(name, namesDB); // <-- Pass the database in
    
    let hitap = ""; 
    if (gender === "M") {
      hitap = "Bey";
      stats.Bey++;
    } else if (gender === "F") {
      hitap = "Hanım";
      stats.Hanim++;
    } else {
      stats.U++;
    }
    salutations.push([hitap]);
  }
  
  let hitapColumn = column + 1;
  
  if (hasHeader) {
    sheet.getRange(startRow, hitapColumn).setValue('Hitap');
  }
  
  const hitapStartRow = hasHeader ? startRow + 1 : startRow;
  const hitapNumRows = salutations.length;
  
  if (hitapNumRows > 0) {
     sheet.getRange(hitapStartRow, hitapColumn, hitapNumRows, 1).setValues(salutations);
  }
 
  const total = stats.Bey + stats.Hanim + stats.U;
  const message = `Salutation (Hitap) Generation Complete!\n\n` +
    `Total: ${total} names processed\n` +
    `Bey: ${stats.Bey}\n` +
    `Hanım: ${stats.Hanim}\n` +
    `Unknown: ${stats.U}`;
  
  ui.alert('Success', message, ui.ButtonSet.OK);
}