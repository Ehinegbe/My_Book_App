async function loadIntoTable(url, table) {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    const response = await fetch(url);
    const { headers, rows } = await response.json();

    //Clear the table
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";

    //Populate the headers
    for (const headerText of headers) {
        const headerElement = document.createElement("th");
        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);        
    }

    //Populate the rows
    for (const row of rows) {
        const rowElement = document.createElement("tr");

        for (const cellText of row) {
            const cellElement = document.createElement("td");
            cellElement.textContent = cellText;
            rowElement.appendChild(cellElement);
        }
         
        tableBody.appendChild(rowElement);        
    }


}


loadIntoTable("./data.json", document.querySelector("table"));

const form = document.querySelector("form");

form.addEventListener('submit', function (e) {
    //prevent form submission
    e.preventDefault();

    //validate form data
    formValidate();

    tableData = [];

    tableToJson();

    function tableToJson () {
        const table = document.querySelector("table");
        
        console.log(table);
        const tableRows = table.rows;
        const headers = [];
        const rows = [];
                

        //Extract table headers
        for (let i=0; i < tableRows[0].cells.length; i++) {
            headers[i] = tableRows[0].cells[i].innerHTML;
        }

        tableData["headers"] = headers;        
  
        // Skip header row (start from index 1) to extract table rows
        for (let i=1; i < tableRows.length; i++) {
          const cells = tableRows[i].cells;
          let rowData = [];
          for (let j=0; j < cells.length; j++) {
            rowData[j] = cells[j].innerHTML;
          }
          
          rows.push(rowData);
          
        }

        //Extract form values
        let rowData = [];
        rowData[0] = document.getElementById('title').value;
        rowData[1] = document.getElementById('author').value;
        rowData[2] = document.getElementById('year').value;
        rowData[3] = document.getElementById('genre').value;
        rows.push(rowData);

        tableData["rows"] = rows;          

        
    }

    //console.log(tableData);

    // Send data to the server as JSON
    /*
    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
    });  */

    fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
    })
    .then(response => response.text())
    .then(message => alert(message))
    .catch(error => console.error('Error:', error));
    


    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('year').value = "";
    document.getElementById('genre').value = "";

    loadIntoTable("./data.json", document.querySelector("table"));


});

function formValidate () {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const genre = document.getElementById('genre').value;
    

    let title_error = document.getElementById('title_error');
    let author_error = document.getElementById('author_error');
    let year_error = document.getElementById('year_error');
    let genre_error = document.getElementById('genre_error');

    title_error.textContent = "";
    author_error.textContent = "";
    year_error.textContent = "";
    genre_error.textContent = "";

    
    if (title === "") {
        title_error.textContent = "Please enter a title";
        title_error.style.color = "red";
        return false;
    }
    if (author === "") {
        author_error.textContent = "Please enter an author";
        author_error.style.color = "red";
        return false;
    }
    //check if year is in 4 digits and not greater than the present year
    //!/^\d*{4}$/.test(year)
    if (year.length != 4 || !year.match(/\d{4}/) || year > new Date().getFullYear()) {
        year_error.textContent = "Please enter a valid year";
        year_error.style.color = "red";
        return false;
    }
    if (genre === "") {
        genre_error.textContent = "Please enter a genre";
        genre_error.style.color = "red";
        return false;
    }

    return true;

}
