fileSelector = document.getElementById("fileSelector")
fileUploadedName = document.getElementById("fileUploadedName")
fileUploaded_StartButton = document.getElementById("fileUploaded_StartButton")

fileSelector.addEventListener('change', (e) => {
    let file = e.target.files[0];
    fileUploadedName.className= fileUploadedName.className + " active"
    fileUploadedName.innerHTML = '<span>' + file.name + '</span> is ready!';
    fileUploaded_StartButton.disabled = false
})


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

        reader.addEventListener('load', function() {
            var result = JSON.parse(reader.result); // Parse the result into an object 
            let columns = []
            if (Array.isArray(result)) {
                // all columns is an set of all columns
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
            
            console.log(columns)
            new GenerateQuestions(columns); // generate the types questions
        });
        
        reader.readAsText(file);
    }

    // console.log(file)
    // var generateQuestions = new GenerateQuestions(["column1", "column2", "column3"])
})