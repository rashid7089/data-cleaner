fileSelector = document.getElementById("fileSelector")
fileUploadedName = document.getElementById("fileUploadedName")
fileUploaded_StartButton = document.getElementById("fileUploaded_StartButton")
let AllData = []

fileSelector.addEventListener('change', (e) => {
    let file = e.target.files[0];
    fileUploadedName.className= fileUploadedName.className + " active"
    fileUploadedName.innerHTML = '<span>' + file.name + '</span> is ready!';
    fileUploaded_StartButton.disabled = false
})

function GetColumnsWithNullOrEmptyValues(object, columnsNames = []) {
    if (columnsNames == []) return []

    let columnsWithNullValues = []
    if(Array.isArray(object)) {
        for (let i = 0; i < object.length; i++) {
            let columns = Object.keys(object[i])
            for (let j = 0; j < columns.length; j++) {
                if (object[i][columns[j]] == null || object[i][columns[j]] == undefined || object[i][columns[j]] == "") {
                    columnsWithNullValues.push(columns[j])
                }
            }
        }
    }
    else {
        columnsWithNullValues = columnsNames.filter(column => object[column] == null)
        return columnsWithNullValues // because it's just 1 element
    }

    let counter = {}
    for (let i = 0; i < object.length; i++) {
        let columns = Object.keys(object[i])
        columns.forEach(column => {
                if (counter[column]) {
                    counter[column] += 1
                }
                else {
                    counter[column] = 1
                }
        })
    }

    
    let co = Object.keys(counter).filter(column => counter[column] < object.length)
    return [...new Set(columnsWithNullValues.concat(co))]

}

// read the json file to generate the questions
// then send the file and the answers to the server
// * send by using submit button generated in the GenerateQuestions class
fileUploaded_StartButton.addEventListener('click', (e) => {
    if (fileSelector) {
        if (fileSelector.files.length == 0) {
            alert('Error : No file selected')
            return
        }
        let file = fileSelector.files[0]
        var reader = new FileReader(); // File reader to read the file 
        
        reader.readAsText(file);
        // csv file convert to string
        reader.addEventListener('load', function() {
            console.log("loaded")

            var result = csvToJson(reader.result);
        //     var result = JSON.parse(reader.result); // Parse the result into an object 
            AllData = result
            let columns = []

            if (Array.isArray(result)) {
                // allcolumns is an set of all columns
                let AllColumns = []

                for (let i = 0; i < result.length; i++) {
                    let columns = Object.keys(result[i])
                    AllColumns = AllColumns.concat(columns)
                }
               
                // remove duplicates
                columns = [...new Set(AllColumns)]
                
            }
            else {
                // if result is an object
                columns = Object.keys(result)
            }

            let columnsWithNullValues = GetColumnsWithNullOrEmptyValues(result, columns)
            
            // console.log(columns, columnsWithNullValues)
            new GenerateQuestions__columnType(columns, columnsWithNullValues, result); // generate the types questions
        });
        
        // reader.readAsText(file);
    }

    // console.log(file)
    // var generateQuestions = new GenerateQuestions(["column1", "column2", "column3"])
})