//function to write an array of values into a google sheet column

function writeArrayToColumn(dataToPush, colPosition) {
  let mainSheet = SpreadsheetApp.getActiveSheet();
  let array = dataToPush.map(function (el) {
    return [el];
  });
  let range = mainSheet.getRange(2, colPosition, array.length, 1);
  range.setValues(array);
}
