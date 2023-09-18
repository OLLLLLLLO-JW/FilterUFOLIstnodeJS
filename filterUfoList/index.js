const fs = require('fs');
const csvParser = require('csv-parser');
const readline = require('readline');
const filterCSVList = require('./filterCSVList');
const { error } = require('console');
// const filePath = './completeUfoList.csv';
const fileName = 'completeUfoList.csv';

const command = process.argv[1];
process.argv.forEach((item) =>{
    console.log("this is each argument ", item);
})
console.log("Command we want: ", command);
const filePath = command.replace('index.js',fileName)
console.log("Command we have: ", filePath);




// Define arrays to be used later
const CSVresults = [];
let stateLowerCase; 
let fullYear;
const lettersOnlyString = /^[a-z]+$/i;
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
let filteredData = [];
let lowerCaseInputThree; // clean up used things
let filteredResults = [];
let filteredList = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function askQuestion(question){
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
  }

  function lettersOnly(str){
    return lettersOnlyString.test(str);
  }

  function setYearParam(yearInput){
    if (yearInput.length === 4 ){
        return yearInput;
    } else{
        let yearString = String(yearInput);
        if(yearInput > 23){
            fullYear = '19' + yearString;
        } else {
            fullYear = '20' + yearString;
        }
        return Number(fullYear);
    }
  }

  function validateState(stateInput){
    if (!lettersOnly(stateInput) )  {
      console.log("Abbreviation must be a String");
  }else if(stateInput.length !== 2){
      console.log("Abbreviation must be only 2 letters long");
  }else {
      return true;     
  }
  }

  function validateYear(yearInput){
    if (isNaN(yearInput)) {
      console.log("This value is NOT a number");
    }else if (yearInput>currentYear || (yearInput < 1900 && yearInput.length === 4) ){
      console.log(`Please choose a date between 1900 and ${currentYear}`);
    }else if (yearInput.length === 2 || yearInput.length === 4) {
      // setYearParam(yearInput);
      return true;
    }else {
      console.log("Length must be 2 or 4");
    }
  }

  function filterData(stateParam, yearParam) {
    return new Promise((resolve, reject) => {
      const CSVresults = [];
  
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          CSVresults.push(data);
        })
        .on('end', () => {
          const filteredList = filterCSVList.filterCSVList(CSVresults, stateParam, yearParam);
          console.log('CSV file successfully parsed.');
          resolve(filteredList);
        })
        .on('error', (error) => {
          console.error('Error parsing CSV file:', error);
          reject(error);
        });
    });
  }

  async function callFilterCSVList(chosenState, chosenYear) {
    try {
      const filteredResults = await filterData(chosenState, chosenYear);
      return filteredResults;
    } catch (error) {
      throw new Error('Error filtering CSV data: ' + error.message);
    }
  }

async function promptUser(){
  let chosenState = '';
  let chosenYear;
  let finalAnswer;
  let validState = false;
  let validYear = false;
  let validFinalAnswer = false;
  let isDataFiltered = false;

  try {
  while( !validState){
   chosenState = await askQuestion('Choose a state using abbreviation ');
   chosenState = chosenState.toLowerCase();
   validState = validateState(chosenState);
   if (!validState){
      console.log('Please enter a valid state.');
    } 
  } // end of valid state
  console.log("valid state: ", chosenState);

  while(!validYear){
    chosenYear = await askQuestion('Choose a year: ');
    validYear = validateYear(chosenYear);
    if (!validYear){
      console.log('Please enter a valid year.');
    } 
  } // end of valid year
  chosenYear = setYearParam(chosenYear);
  console.log("valid year: ", chosenYear);

  filteredData =   await callFilterCSVList(chosenState,chosenYear); // call the filter data funciton
  console.log("filteredData: ", filteredData);
  // console.log("after fiilterd data");
  // console.log(filteredData);

  
  while(!validFinalAnswer){
    console.log("inside final answer");
    finalAnswer = await askQuestion('Is this data correct? yes or no?')
    finalAnswer = finalAnswer.toLowerCase(); // trim answer to get spaces surrounding no and y and n
    if (finalAnswer === 'yes' || finalAnswer === 'no'){
      console.log("correct answer! ", finalAnswer);
      validFinalAnswer = true;
    } else {
      console.log("try again", finalAnswer);
      console.log(filteredData);
    }
  }
}catch(error){
  console.error('An error occurred:', error);
}finally{
  rl.close();
}

}


    promptUser();