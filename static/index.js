
async function processFile(file) {
    // var file = document.getElementById('file').files[0];
    // await for response
    // sendFile(file);

}

function sendData() {
    var value = document.getElementById("input").value;
    $.ajax({
        url: '/process',
        type: 'POST',
        contentType: 'application/json',
        enctype: 'multipart/form-data',
        data: JSON.stringify({ 'value': value }),

        success: (response) => {
            document.getElementById('output').innerHTML = response.result;
        },
        error: (error) => {
            document.getElementById('output').innerHTML = "response.result error;"
        }
    })
}


// function sendFile(file) {
//     // send file to server
//     var formData = new FormData();
//     formData.append('file', file);
//     fetch('/process', {
//         method: 'POST',
//         body: formData,
//         contentType: 'application/json',

//     }).then(res => {
//         return res.json()
//     }).then(data => {
//         console.log(data)
//     })
//     console.log(formData)
// }







 // fetch('/json').then(res => {
        //     console.log(res.json())
// })