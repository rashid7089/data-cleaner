var ColumnsNames = [] // inilialized in Step 1
var ColumnsTypes = {} // inilialized in Step 2
var OrdinalOrders_Data = {}
var ordinalOrder_Queue = []

// step 1: generate columnType questions
class GenerateQuestions__columnType {
    constructor(columnsNames = [], columnsWithNullValues = [], data = []) {
        this.generateHTML(columnsNames, columnsWithNullValues)

        // initialize the GLOBAL VARIABLES
        ColumnsNames = columnsNames
    }
    
    generateHTML = (columnsNames, columnsWithNullValues) => {
        const QuestionsStartHere = document.getElementById("questionsStartHere"); // start after this element
        // generate questions html

        // columns Types
        for (let i = 0; i < columnsNames.length; i++) {
            let isLastElement = columnsNames.length - 1 == i
            
            QuestionsStartHere.insertAdjacentHTML(
              "beforeend",
              columnType_question(
                columnsNames[i],
                columnsWithNullValues.includes(columnsNames[i]),
                isLastElement,
                "finish_typeQuestionsSection"
              )
            );
        }
    }
}


// step 2: geneerate impute questions
/*
    this questions will only generate after the columnType question has been answered
    so it will be called inside the columnType_question onclick event
*/
function generateImputeQuestion(columnName) {
    console.log("generate Impute question for column: ", columnName)
    const QuestionsStartHere = document.getElementById("questionsStartHere"); // start after this element
    let columnType = document.querySelector(`input[name="${columnName}_columnType"]:checked`).value // get the type of the column
    QuestionsStartHere.insertAdjacentHTML('beforeend', impute_question(columnName, columnType)); // generate html
}

// just after generating all the Impute Questions ( not answered yet )
function finish_typeQuestionsSection() {
    // if all Impute Questions generated, this mean that the user has answered all the ColumnType questions
    // therefore All ColumnType questions is answered

    // get all columnsType
    let columnsType = {}
    for (let i = 0; i < ColumnsNames.length; i++) {
        columnsType[ColumnsNames[i]] = document.querySelector(`input[name="${ColumnsNames[i]}_columnType"]:checked`).value
    }

    ColumnsTypes = columnsType

    // generate step 3
    new GenerateQuestions__columnNormalization();
}


// step 3: generate NormalizationSequence
class GenerateQuestions__columnNormalization {
    constructor() {
        let numericColumns = this.getNumericColumns(ColumnsTypes)
        this.generateHTML(numericColumns);

        // generate step 4
        new GenerateQuestions__NominalEncoding();
    }

    getNumericColumns = (columnsTypes) => {
        let numericColumns = []
        for (let column in columnsTypes) {
            if (columnsTypes[column] == 'numerical') {
                numericColumns.push(column)
            }
        }
        return numericColumns
    }
    
    generateHTML = (columnsNames) => {
        const QuestionsStartHere = document.getElementById("questionsStartHere"); // start after this element

        // generate questions html
        for (let i = 0; i < columnsNames.length; i++) {
            QuestionsStartHere.insertAdjacentHTML('beforeend', columnNormalization_question(columnsNames[i]))
        }
    }
}

// step 4: generate NominalEncodingSequence
class GenerateQuestions__NominalEncoding {
    constructor() {
        let nominalColumns = this.getNominalColumns(ColumnsTypes)
        this.generateHTML(nominalColumns);

        // generate step 5
        new GenerateQuestions__OrdinalEncoding();
    }

    getNominalColumns = (columnsTypes) => {
        let nominalColumns = []
        for (let column in columnsTypes) {
            if (columnsTypes[column] == 'nominal') {
                nominalColumns.push(column)
            }
        }
        return nominalColumns
    }
    
    generateHTML = (columnsNames) => {
        const QuestionsStartHere = document.getElementById("questionsStartHere"); // start after this element

        // generate questions html
        for (let i = 0; i < columnsNames.length; i++) {
            QuestionsStartHere.insertAdjacentHTML('beforeend', nominalEncoding_question(columnsNames[i]))
        }
    }
}


// step 5: generate OrdinalEncodingSequence
class GenerateQuestions__OrdinalEncoding {
    constructor() {
        let ordinalColumns = this.getOrdinalColumns(ColumnsTypes)
        this.generateHTML(ordinalColumns);

        // generate submit button
        // generateSubmitButton();
    }

    getOrdinalColumns = (columnsTypes) => {
        let ordinalColumns = []
        for (let column in columnsTypes) {
            if (columnsTypes[column] == 'ordinal') {
                ordinalColumns.push(column)
            }
        }
        return ordinalColumns
    }

    
    
    generateHTML = (columnsNames) => {
        const QuestionsStartHere = document.getElementById("questionsStartHere"); // start after this element

        // generate questions html
        for (let i = 0; i < columnsNames.length; i++) {
            const isLastElement = columnsNames.length - 1 == i
            QuestionsStartHere.insertAdjacentHTML(
              "beforeend",
              ordinalEncoding_question(
                columnsNames[i],
                "generateOrdinalOrderQuestion",
                isLastElement,
                "finish_ordinalEncodingQuestionsSection"
              )
            );
        }
    }
}

const getOrdinalUniqueValues = (columnName) => {    
    const values = AllData.map(d => d[columnName])
    const uniqueValues = [...new Set(values)].filter(v => v != null && v != undefined)
    return uniqueValues;
}

const generateOrdinalOrderQuestion = (columnName, answer) => {
    if (answer == "None") return; 
    ordinalOrder_Queue.push(columnName)
    // new GenerateOrdinalOrderQuestion(columnName);
    
}

const finish_ordinalEncodingQuestionsSection = () => {
    if (ordinalOrder_Queue.length == 0) {
        generateSubmitButton();
        return;
    }
    new GenerateOrdinalOrderQuestion(ordinalOrder_Queue.shift());
}

// generate ordinal order questions
class GenerateOrdinalOrderQuestion {
  constructor(columnName) {
    let uniqueValues = getOrdinalUniqueValues(columnName);
    let allOptions = [];
    for (let i = 1; i <= uniqueValues.length; i++) {
      allOptions.push(i);
    }

    OrdinalOrders_Data[columnName] = {
      uniqueValues: uniqueValues,
      AllOptions: allOptions,
      usedOptions: [],
    };

    addTo__OrdinalOrders_Data(columnName, 0, 0);
  }

}

const addTo__OrdinalOrders_Data = (columnName, value, index) => {
    const QuestionsStartHere = document.getElementById("questionsStartHere"); // start after this element
    
    if (value != 0) OrdinalOrders_Data[columnName].usedOptions.push(value); // no value will be 0
    const { uniqueValues, AllOptions, usedOptions } = OrdinalOrders_Data[columnName];
    
    if (usedOptions.length == uniqueValues.length) {
        if (ordinalOrder_Queue.length == 0) {
            generateSubmitButton();
            return;
        }
        new GenerateOrdinalOrderQuestion(ordinalOrder_Queue.shift());
        return;
    }

    QuestionsStartHere.insertAdjacentHTML(
      "beforeend",
      ordinalOrder_question(
        columnName,
        uniqueValues[index],
        AllOptions,
        usedOptions,
        index,
        "addTo__OrdinalOrders_Data"
      )
    );
};






function generateSubmitButton() {
    const QuestionsStartHere = document.getElementById("questionsStartHere"); // start after this element

    QuestionsStartHere.insertAdjacentHTML('beforeend', `
        <div id="submitContainer" class="container__body">
            <label class="label-primary">Submit Your Answers</label>
            <button type="submit" id="section_question_submit" class="button-primary">Submit</button>
        </div>
    `)
}


