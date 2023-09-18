// const csvArray = [];
const filteredArray = [];

function filterCSVList(csvArray, stateParam, yearParam){
    // console.log("state param", stateParam);
    // console.log("year param", yearParam);
    csvArray.forEach(element => {
        if (element.state === stateParam){
            let dateParts = element.datetime.split(/[\/\s]/);  // Split by '/' and ' '
            let year = parseInt(dateParts[2]);
            if (year === Number(yearParam)){
                filteredArray.push(element);
            }
        } else {
            // console.log("State not mapped yet");
        } 
    });
    // console.log('filteredArray:', filteredArray[1]);
    return filteredArray;
};

module.exports.filterCSVList = filterCSVList;