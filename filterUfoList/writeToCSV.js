const fs  = require('fs')

function writeToCSV(data, filename){

    function convertArrayToCSV(data) {
        const header = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj).join(','));
        return `${header}\n${rows.join('\n')}`;
      }

      const csvString = convertArrayToCSV(data);

      fs.writeFile(`${filename}.csv`, csvString, 'utf8', err => {
        if (err) {
          console.error('Error writing CSV file:', err);
        } else {
          console.log('CSV file has been written successfully.');
        }
      });

}

module.exports.writeToCSV = writeToCSV;