import React, { useState } from "react";
import { TextField, Box, Typography, Stack } from "@mui/material";

// --- MATH HELPERS ---
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = ({ r, g, b }) => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

const lighten = (hex, amount) => {
  const { r, g, b } = hexToRgb(hex);
  const amt = parseFloat(amount) || 0;
  return {
    r: Math.min(255, Math.round(r + (255 - r) * amt)),
    g: Math.min(255, Math.round(g + (255 - g) * amt)),
    b: Math.min(255, Math.round(b + (255 - b) * amt))
  };
};

const darken = (hex, amount) => {
  const { r, g, b } = hexToRgb(hex);
  const amt = parseFloat(amount) || 0;
  return {
    r: Math.max(0, Math.round(r * (1 - amt))),
    g: Math.max(0, Math.round(g * (1 - amt))),
    b: Math.max(0, Math.round(b * (1 - amt)))
  };
};

const toValidHex = (color) => {
  if (!color) return "#000000";
  const formattedColor = color.startsWith("#") ? color : `#${color}`;
  return formattedColor.length === 7 ? formattedColor : "#000000";
};

// --- MAIN COMPONENT ---
const App = () => {
  const [color, setColor] = useState("007BFF");
  const [lightAmount, setLightAmount] = useState(0.3); // New State
  const [darkAmount, setDarkAmount] = useState(0.3);   // New State

  const baseHex = toValidHex(color);
  const lighterColor = rgbToHex(lighten(baseHex, lightAmount));
  const darkerColor = rgbToHex(darken(baseHex, darkAmount));

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", p: 4, bgcolor: 'white', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Roy's Color-Calculator
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        {/* Color Input */}
        <TextField
          label="HEX Color"
          variant="outlined"
          value={color}
          onChange={(e) => setColor(e.target.value.replace("#", ""))}
          sx={{ width: "150px" }}
          inputProps={{ maxLength: 6 }}
        />

        {/* Lighten Amount Input */}
        <TextField
          label="Lighten (e.g. 0.3)"
          type="number"
          variant="outlined"
          value={lightAmount}
          onChange={(e) => setLightAmount(e.target.value)}
          sx={{ width: "150px" }}
          inputProps={{ step: 0.1, min: 0, max: 1 }}
        />

        {/* Darken Amount Input */}
        <TextField
          label="Darken (e.g. 0.3)"
          type="number"
          variant="outlined"
          value={darkAmount}
          onChange={(e) => setDarkAmount(e.target.value)}
          sx={{ width: "150px" }}
          inputProps={{ step: 0.1, min: 0, max: 1 }}
        />
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
        {[
          { label: "Base", hex: baseHex, value: "" },
          { label: `Lighten`, hex: lighterColor, value: lightAmount },
          { label: `Darken`, hex: darkerColor, value: darkAmount },
        ].map(({ label, hex, value }) => (
          <Box key={label} sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 120, height: 120, bgcolor: hex, borderRadius: 3,
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", border: "1px solid #ddd",
                transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }
              }}
              onClick={() => copyToClipboard(hex)}
            >
              <Typography sx={{ color: "#fff", fontWeight: "bold", textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}>
                {hex}
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
              {label} {value ? `(${value})` : ""}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography sx={{ mt: 4, color: 'text.secondary' }}>
        Click a box to copy the HEX code
      </Typography>
    </Box>
  );
};

export default App;