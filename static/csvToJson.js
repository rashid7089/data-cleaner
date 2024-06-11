function csvToJson(csvString) {
  const regex = /,(?=(?:[^"]*"[^"]*")*(?![^"]*"))/;
  const rows = csvString.split("\n");
  const headers = rows[0].split(regex);
  console.log(headers)
  const jsonData = [];

  for (let i = 1; i < rows.length; i++) {
    if (rows[i] === "") continue

    const values = rows[i].split(regex);
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = values[j].trim();
    }
    jsonData.push(obj);
  }

  return JSON.parse(JSON.stringify(jsonData));
}
