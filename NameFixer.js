/**
 * Finds and replaces Turkish name misspellings in two stages.
 * Stage 1: Specific names from the "Dictionary" sheet.
 * Stage 2: General "oe" -> "ö" and "ue" -> "ü" conversions.
 *
 * This version runs ONLY ON THE CELLS THE USER HAS SELECTED.
 */
function fixTurkishNames() {
  const ui = SpreadsheetApp.getUi();
  
  // 1. Define the dictionary sheet name
  const dictionarySheetName = "Dictionary"; 

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 2. Get the active sheet *name* (for safety check)
  const activeSheetName = ss.getActiveSheet().getName();

  // 3. SAFETY CHECK: Stop if the user is on the Dictionary sheet
  if (activeSheetName === dictionarySheetName) {
    ui.alert(`Please select a contact sheet first (like "${activeSheetName}"), not the Dictionary sheet.`);
    return;
  }

  // --- THIS IS THE KEY FIX ---
  // Get the *currently selected* range, not the whole sheet
  const selection = ss.getActiveRange();

  if (!selection) {
    ui.alert("Please select the cells (or column) you want to fix first.");
    return;
  }
  // --- END OF FIX ---


  // 4. Get the "Dictionary" sheet
  const dictSheet = ss.getSheetByName(dictionarySheetName);
  if (!dictSheet) {
    ui.alert(`Error: Sheet named "${dictionarySheetName}" not found. Please create it with 'Find' in Col A and 'Replace' in Col B.`);
    return;
  }

  // 5. Get all the replacement pairs from the "Dictionary" sheet
  const replacementPairs = dictSheet.getRange("A1:B" + dictSheet.getLastRow()).getValues();
  const validPairs = replacementPairs.filter(row => row[0] && row[1]);

  if (validPairs.length > 0) {
    ui.alert(`Starting Stage 1: Fixing ${validPairs.length} specific names from "Dictionary"...`);
    
    // 6. STAGE 1: Loop through specific pairs from the sheet
    validPairs.forEach(pair => {
      const findText = pair[0];
      const replaceText = pair[1];
      
      // Run the finder ONLY on the 'selection'
      selection.createTextFinder(findText)
             .matchCase(true) // Match "Goerkem" but not "goerkem"
             .replaceAllWith(replaceText);
    });
  } else {
    Logger.log("No specific pairs found in 'Dictionary' sheet. Skipping Stage 1.");
  }

  // 7. STAGE 2: Define and run general "redundancy" pairs
  const generalPairs = [
    ["oe", "ö"],
    ["Oe", "Ö"],
    ["ue", "ü"],
    ["Ue", "Ü"]
  ];

  ui.alert(`Starting Stage 2: Running general 'oe/ue' corrections...`);

  generalPairs.forEach(pair => {
    const findText = pair[0];
    const replaceText = pair[1];
    
    // Run the finder ONLY on the 'selection'
    selection.createTextFinder(findText)
           .matchCase(true) // Must match case to get "Oe" -> "Ö"
           .replaceAllWith(replaceText);
  });
  
  ui.alert(`Name correction complete for the selected cells.`);
}