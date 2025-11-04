/**
 * This script is responsible for creating all custom menus.
 * It is the ONLY onOpen function in the entire project.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Admin Tools')
    .addItem('Fix Turkish Names', 'fixTurkishNames')
    .addItem('Add Salutations (Hitap)', 'addSalutations')
    .addItem('Fix Turkish Emails', 'fixTurkishEmails') 
    .addSeparator()
    .addToUi();
}