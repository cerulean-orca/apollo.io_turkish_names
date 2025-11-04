/**
 * Fixes Turkish characters in email addresses.
 * Converts "oe" -> "o" and "ue" -> "u".
 * This version runs only on the RANGE THE USER HAS SELECTED.
 */
function fixTurkishEmails() {
  const ui = SpreadsheetApp.getUi();
  
  // 1. Get the *currently selected* range
  const selection = SpreadsheetApp.getActiveRange();
  
  if (!selection) {
    ui.alert("Please select the email column (or a range of cells) first.");
    return;
  }

  // 2. Define the email-specific replacement pairs
  const emailPairs = [
    ["oe", "o"],
    ["Oe", "O"], // Handle "Oemer" -> "Omer"
    ["ue", "u"],
    ["Ue", "U"]  // Handle "Uenal" -> "Unal"
  ];

  ui.alert(`Starting email correction on the selected cells...`);

  // 3. Loop through each pair and apply the correction
  emailPairs.forEach(pair => {
    const findText = pair[0];
    const replaceText = pair[1];
    
    // Run the text finder only on the selected range
    selection.createTextFinder(findText)
             .matchCase(true)
             .replaceAllWith(replaceText);
  });
  
  ui.alert(`Email correction complete.`);
}