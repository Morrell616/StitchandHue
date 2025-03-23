document.addEventListener("DOMContentLoaded", () => {
    const userColorInput = document.getElementById("color-name");
    const schemeType = document.getElementById("color-scheme");
    const generateButton = document.getElementById("generate-palette");
    const colorDetailsDiv = document.getElementById("color-details");
    const chosenColorContainer = document.querySelector(".chosen-color-box");


 

  generateButton.addEventListener("click", async () => {
        const userColor = userColorInput.value.trim();
        const mode = schemeType.value;

        console.log("generate palette button clicked");
        console.log("user inputs - color name", userColor, "scheme type", mode);


        if (tinycolor(userColor).isValid()) {
            chosenColorContainer.style.backgroundColor = tinycolor(userColor).toHexString();
            chosenColorContainer.textContent = userColor;
        } else {
            console.error("Invalid color was entered.");
        }
        const color = tinycolor(userColor);
        const hexCode = color.toHex();
        console.log("Hex code:", hexCode);
        
        try {  //get color scheme data from API
            console.log("sending POST to api colors");
            const response = await fetch("/api/colors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userColor, schemeType: mode}),
            });
                console.log("response received from server");
                const data = await response.json();
                console.log("data received:", data);
            
                displayColorDetails(data.colorInfo);

                renderColorPalette(data.palette);
        } catch (error) {
            console.error("Error fetching color palette:", error);

        }
    });

    function displayColorDetails(colorInfo) {
        const colorBoxHTML = `
          <p><strong>Name:</strong> ${colorInfo.name.value}</p>
          <p><strong>Hex Code:</strong> ${colorInfo.hex.value}</p>
          <p><strong>RGB:</strong> ${colorInfo.rgb.value}</p>
          <div class="chosen-color-box" "style="background-color: ${colorInfo.hex.value};"></div>
          `;
    }

    function renderColorPalette(palette) {
        const paletteContainer = document.getElementById("generated-palette");
        paletteContainer.innerHTML = ""; // clears previous palette

        palette.forEach(color => {
            const colorDiv = document.createElement("div");
            colorDiv.style.backgroundColor = color.hex.value;
            colorDiv.className = "palette-box";
            colorDiv.textContent = color.hex.value;
            paletteContainer.appendChild(colorDiv);
        });

    }


     function updateColors(colors) {
        for (let i = 0; i < 5; i++) {
            const colorDiv = document.getElementById(`color${i + 1}`);
             if (colorDiv && colors[i]) {
                    // Update the background color
                    colorDiv.style.backgroundColor = colors[i].hex.value;
        
                    // Optional: Add the hex code as text inside the div
                    colorDiv.innerText = colors[i].hex.value;
          } else if (colorDiv) {
                    // Fallback for missing colors
                    colorDiv.style.backgroundColor = "#FFFFFF";
                    colorDiv.innerText = "N/A";
          }
        }
    }  
});