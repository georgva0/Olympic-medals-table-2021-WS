function clearRecords() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tableSheet = ss.getSheetByName("Sheet1");
  tableSheet.getRange("A2:A250").clear();
  tableSheet.getRange("D2:I250").clear();
}
