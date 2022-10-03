function getXML(event) {

  //credentials
  const username = PropertiesService.getScriptProperties().getProperty('username');
  const password = PropertiesService.getScriptProperties().getProperty('password');

  //get the XML feed containing Olympic rankings 

  //let response = UrlFetchApp.fetch('https://sw5feedstaging.xmlteam.com/api/documents?start=P2M&publisher-keys=ioc.org&fixture-keys=standings-medal&limit=1&filename-filters=bbc',
  let response = UrlFetchApp.fetch('https://feed.xmlteam.com/api/documents?start=P1D&publisher-keys=ioc.org&fixture-keys=standings-medal&limit=1&filename-filters=xt.bbc.odf',
    {
      headers: {
        Authorization: "Basic " + Utilities.base64Encode(`${username}:${password}`)
      }
    });
  let xml = response.getContentText();
  const document = XmlService.parse(xml);

  //extract the relevant "team" nodes from the XML feed

  //let teamData = document.getRootElement().getChild('sports-content').getChild('sports-event').getChildren('team');
  let teamData = document.getRootElement().getChild('sports-content').getChild('tournament').getChild('standing').getChildren('team');
  let teamKey = [];
  let rankingData = [];
  let goldMedals = [];
  let silverMedals = [];
  let bronzeMedals = [];
  let totalMedals = [];

  //push values for team keys and medal numbers in empty arrays
  for (i in teamData) {
    teamKey.push(teamData[i].getChild('team-metadata').getAttribute('team-key').getValue());
    //countryData.push(teamData[i].getChild('team-metadata').getChild('name').getAttribute('full').getValue());
    rankingData.push(teamData[i].getChild('team-stats').getChild('rank').getAttribute('value').getValue());
    goldMedals.push(teamData[i].getChild('team-stats').getChildren('award')[0].getAttribute('total').getValue());
    silverMedals.push(teamData[i].getChild('team-stats').getChildren('award')[1].getAttribute('total').getValue());
    bronzeMedals.push(teamData[i].getChild('team-stats').getChildren('award')[2].getAttribute('total').getValue());
    totalMedals.push(teamData[i].getChild('team-stats').getChildren('award')[3].getAttribute('total').getValue());
  }

  //remove prefix from team-key values to obtain country ISO codes
  //let pre = 'cg.olympic.org-summer-t.';
  let pre = 'TI';
  teamKey.forEach(function (v, i) { teamKey[i] = v.slice(pre.length).toUpperCase(); });

  //combine the arrays:
  let list = [];
  for (let j = 0; j < rankingData.length; j++)
    list.push({
      'rank': rankingData[j],
      'team': teamKey[j],
      'total': totalMedals[j],
      'goldMedals': goldMedals[j],
      'silverMedals': silverMedals[j],
      'bronzeMedals': bronzeMedals[j]
    });

  //sort array of objects by rank:
  list.sort(function (a, b) {
    return a.rank - b.rank;
  });

  //separate objects array back out in separate arrays:
  for (let k = 0; k < list.length; k++) {
    rankingData[k] = list[k].rank;
    teamKey[k] = list[k].team;
    totalMedals[k] = list[k].total;
    goldMedals[k] = list[k].goldMedals;
    silverMedals[k] = list[k].silverMedals;
    bronzeMedals[k] = list[k].bronzeMedals;
  }

  //target active sheet and clean the relevant columns
  let mainSheet = SpreadsheetApp.getActiveSheet();
  mainSheet.getRange(2, 1, mainSheet.getLastRow(), 1).clearContent();
  mainSheet.getRange(2, 4, mainSheet.getLastRow(), 6).clearContent();

  //write all array values in their columns
  writeArrayToColumn(teamKey, 9);
  writeArrayToColumn(rankingData, 1);
  writeArrayToColumn(goldMedals, 4);
  writeArrayToColumn(silverMedals, 5);
  writeArrayToColumn(bronzeMedals, 6);
  writeArrayToColumn(totalMedals, 7);
  //writeArrayToColumn(countryData, 3);

}
