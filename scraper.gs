//this is a scraper that can be used as an alternative if the getXML function fails for any reason - currenly the scraper's target page is not available
function scrapeOlympicMedalsTable() {

  //remove content from all relevant columns in the spreadsheet
  clearRecords();

  //get content from HTML
  let url = "https://olympics.com/tokyo-2020/olympic-games/en/results/all-sports/medal-standings.htm";
  let str = UrlFetchApp.fetch(url).getContentText();

  //isolate the table rows that contain relevant team data from the rest of the string
  const mainRegex = /<tr>\s*<td class=\"text-center\">([\s\S]*?)<\/tr>/gi;
  const teamRows = str.match(mainRegex);

  //extract the country / team codes into an array using regex 
  const countryCodeRegex = /<div class=\"playerTag\" country=\"[a-zA-Z]{3}\"/gi;
  const countryCodeItems = /(?<=<div class=\"playerTag\" country=\")[a-zA-Z]{3}(?=\")/gi;

  let codesExpanded = [];
  teamRows.forEach(teamRow => {
    codesExpanded.push(teamRow.match(countryCodeRegex));
  })

  let countryCodes = [];
  codesExpanded.flat().forEach(codeExpanded => {
    countryCodes.push(codeExpanded.match(countryCodeItems));
  });

  //extract the rankings into an array using regex 
  const rankRegex = /<td class=\"text-center\">\s*<strong>(\d+)<\/strong>/gi;
  const rankItem = /(?<=<td class=\"text-center\">\s*<strong>)\d+(?=<\/strong>)/gi;

  let ranksExpanded = [];
  teamRows.forEach(teamRow => {
    ranksExpanded.push(teamRow.match(rankRegex));
  })

  let ranks = [];
  ranksExpanded.flat().forEach(rankExpanded => {
    ranks.push(rankExpanded.match(rankItem));
  });

  //extract gold medal numbers into an array using regex; add 0 if there are no gold medals
  const goldRegex = /title=\"[A-Z]{3}\s*Gold\s*Medal\s*Total\">\s*(\d+)<\/a>/gi;
  const goldItem = /(?<=title=\"[A-Z]{3}\s*Gold\s*Medal\s*Total\">\s*)(\d+)(?=<\/a>)/gi;

  let goldsExpanded = [];
  teamRows.forEach(teamRow => {
    if (teamRow.match(goldRegex)) {
      goldsExpanded.push(teamRow.match(goldRegex));
    } else {
      goldsExpanded.push(["0"]);
    }
  });

  let golds = [];
  goldsExpanded.flat().forEach(goldExpanded => {
    if (goldExpanded.match(goldItem)) {
      golds.push(goldExpanded.match(goldItem));
    } else {
      golds.push([0]);
    }
  })


  //extract silver medal numbers into an array using regex 
  const silverRegex = /title=\"[A-Z]{3}\s*Silver\s*Medal\s*Total\">\s*(\d+)<\/a>/gi;
  const silverItem = /(?<=title=\"[A-Z]{3}\s*Silver\s*Medal\s*Total\">\s*)(\d+)(?=<\/a>)/gi;

  let silversExpanded = [];
  teamRows.forEach(teamRow => {
    if (teamRow.match(silverRegex)) {
      silversExpanded.push(teamRow.match(silverRegex));
    } else {
      silversExpanded.push(["0"]);
    }
  });

  let silvers = [];
  silversExpanded.flat().forEach(silverExpanded => {
    if (silverExpanded.match(silverItem)) {
      silvers.push(silverExpanded.match(silverItem));
    } else {
      silvers.push([0]);
    }
  })

  //extract bronze medal numbers into an array using regex 
  const bronzeRegex = /title=\"[A-Z]{3}\s*Bronze\s*Medal\s*Total\">\s*(\d+)<\/a>/gi;
  const bronzeItem = /(?<=title=\"[A-Z]{3}\s*Bronze\s*Medal\s*Total\">\s*)(\d+)(?=<\/a>)/gi;

  let bronzesExpanded = [];
  teamRows.forEach(teamRow => {
    if (teamRow.match(bronzeRegex)) {
      bronzesExpanded.push(teamRow.match(bronzeRegex));
    } else {
      bronzesExpanded.push(["0"]);
    }
  });

  let bronzes = [];
  bronzesExpanded.flat().forEach(bronzeExpanded => {
    if (bronzeExpanded.match(bronzeItem)) {
      bronzes.push(bronzeExpanded.match(bronzeItem));
    } else {
      bronzes.push([0]);
    }
  })

  //extract total medal numbers into an array using regex 
  const totalRegex = /Total\">\s*<strong>(\d+)<\/strong>/gi;
  const totalItem = /(?<=Total\">\s*<strong>)\d+(?=<\/strong>)/gi

  let totalsExpanded = [];
  teamRows.forEach(teamRow => {
    totalsExpanded.push(teamRow.match(totalRegex));
  });

  let totals = [];
  totalsExpanded.flat().forEach(totalExpanded => {
    totals.push(totalExpanded.match(totalItem));
  });

  //write arrays in their relevant columns
  let mainSheet = SpreadsheetApp.getActiveSheet();
  let rangeCountryCodes = mainSheet.getRange(2, 9, countryCodes.length, 1);
  let rangeRanks = mainSheet.getRange(2, 1, ranks.length, 1);
  let rangeTotals = mainSheet.getRange(2, 7, totals.length, 1);
  let rangeGolds = mainSheet.getRange(2, 4, golds.length, 1);
  let rangeSilvers = mainSheet.getRange(2, 5, silvers.length, 1);
  let rangeBronzes = mainSheet.getRange(2, 6, bronzes.length, 1);

  rangeCountryCodes.setValues(countryCodes);
  rangeRanks.setValues(ranks);
  rangeTotals.setValues(totals);
  rangeGolds.setValues(golds);
  rangeSilvers.setValues(silvers);
  rangeBronzes.setValues(bronzes);
}
