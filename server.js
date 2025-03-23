"use strict";
const tinycolor = require("tinycolor2");

const express = require("express"); // imports express
const app = express(); // initializes the express application
const path = require("path"); // imports path module
const axios = require("axios");
const cors = require("cors");


const PORT = 4000;

//app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // serves static files from the public directory
app.use(express.json()); // parses incoming JSON requests
app.use(cors());
// Serves the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ColorPalette.html")); // serves index.html

});

// Endpoint for fetching the color palette
app.post("/api/colors", async (req, res) => {
    const {userColor, schemeType} = req.body;

    // validaate the color input
    if (!tinycolor(userColor).isValid()) {
      console.error("invalid color entered:", userColor);
      res.status(400).json({ error: "Invalid color inpu. Please try another color"});
      return;
    }
    const hexCode = tinycolor(userColor).toHex();

    console.log("POST /api/colors route called");
    console.log("Request body received", req.body);

    // convert the color to a hex code

    console.log("color is valid and hex code is:", hexCode);

    try {
        
       const colorInfoResponse = await axios.get(`https://www.thecolorapi.com/id?hex=${hexCode}`);
       const seedColor = colorInfoResponse.data.hex.value;
       console.log("seed color:", seedColor);
        console.log("Color details fetched:", colorInfoResponse.data);

        const paletteResponse = await axios.get(`https://www.thecolorapi.com/scheme?hex=${hexCode}&mode=${schemeType}&count=5`);
        console.log("Color palette fetched:", paletteResponse.data);
       
        res.status(200).json({
        colorInfo: colorInfoResponse.data,
        palette: paletteResponse.data.colors,
        });
        console.log("repsonse sent to client successfully");      
    

} catch (error) {
    console.error("error while fetching color data", error.message);
    res.status(500).send("An error occured while processing please try again!");
}
});



app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));