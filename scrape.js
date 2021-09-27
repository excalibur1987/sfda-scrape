let maxPage = 762;
let fetched = 0;
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const { consolidate } = require("./data-consolidate");

let headers = {};

const baseUrl = "https://www.sfda.gov.sa/GetDrugs.php?page=";

for (let i = 1; i <= maxPage; i++) {
  fetch(baseUrl + i)
    .then((res) => res.json())
    .then((resp) => {
      fs.writeFileSync(
        path.join(__dirname, "pages", `page${i}.json`),
        JSON.stringify(resp["results"], null, 4)
      );
      headers = resp["results"].reduce(
        (acc, cur) => {
          return {
            ...acc,
            ...Object.keys(cur).reduce(
              (acc_, cur_) => ({ ...acc_, [cur_]: 0 }),
              {}
            ),
          };
        },
        { ...headers }
      );
      fetched = fetched + 1;
      if (fetched === maxPage) console.log("Finished"), consolidate();
    });
}
