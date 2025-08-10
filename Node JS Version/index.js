const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON in request body
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// POST route to handle saving the JSON data to hard drive
app.post('/save', (req, res) => {
    const jsonData = req.body;
 
    console.log(jsonData);
  
    // Save to file    
    fs.writeFile('./public/data.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Failed to save data:', err);
        return res.status(500).send('Error saving data');
      }
      res.send('Data saved successfully!');
    }); 
});
