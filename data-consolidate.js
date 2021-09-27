const fs = require("fs");
const path = require("path");

function consolidate() {
  //   let results = [];
  //   let headers = {};

  const files = fs.readdirSync(path.join(__dirname, "pages"));
  /**
   * @type {
   *  results: object[],
   *  headers: object
   * }
   */
  const { results, headers } = files.reduce(
    (acc, file) => {
      /**
       * @type object[];
       */
      const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, "pages", file))
      );
      const headers = data.reduce(
        (acc_, cur) => ({
          ...acc_,
          ...Object.keys(cur).reduce(
            (keys, key) => ({ ...keys, [key]: 0 }),
            {}
          ),
        }),
        {}
      );
      return {
        headers: { ...acc.headers, ...headers },
        results: [...acc.results, ...data],
      };
    },
    {
      results: [],
      headers: {},
    }
  );

  fs.writeFileSync(
    path.join(__dirname, `consolidated.json`),
    JSON.stringify(results, null, 4)
  );
  const colHeaders = Object.keys(headers);

  const csv = [
    colHeaders.map((col) => `"${col}"`).join(","),
    ...results.map((item) =>
      colHeaders.map((col) => (item[col] ? `"${item[col]}"` : "")).join(",")
    ),
  ].join("\n");
  fs.writeFileSync(path.join(__dirname, `consolidated.csv`), csv);
}

consolidate();

module.exports = {
  consolidate: consolidate,
};
