import React, { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";

// --- These math functions are REQUIRED or the app will crash ---
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
  return {
    r: Math.min(255, Math.round(r + (255 - r) * amount)),
    g: Math.min(255, Math.round(g + (255 - g) * amount)),
    b: Math.min(255, Math.round(b + (255 - b) * amount))
  };
};

const darken = (hex, amount) => {
  const { r, g, b } = hexToRgb(hex);
  return {
    r: Math.max(0, Math.round(r * (1 - amount))),
    g: Math.max(0, Math.round(g * (1 - amount))),
    b: Math.max(0, Math.round(b * (1 - amount)))
  };
};

const toValidHex = (color) => {
  if (!color) return "#000000";
  const formattedColor = color.startsWith("#") ? color : `#${color}`;
  return formattedColor.length === 7 ? formattedColor : "#000000";
};

// --- This MUST be named 'App' for Vite to show it automatically ---
const App = () => {
  const [color, setColor] = useState("007BFF");

  const baseHex = toValidHex(color);
  const lighterColor = rgbToHex(lighten(baseHex, 0.3));
  const darkerColor = rgbToHex(darken(baseHex, 0.3));

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <Box sx={{ textAlign: "center", p: 4, bgcolor: 'white', minHeight: '100vh' }}>
      <Typography variant="h5">Lighten/Darken Calculator</Typography>

      <TextField
        label="Enter HEX Color"
        variant="outlined"
        value={color}
        onChange={(e) => setColor(e.target.value.replace("#", ""))}
        sx={{ mt: 2, mb: 3, width: "200px" }}
        inputProps={{ maxLength: 6 }}
      />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        {[
          { label: "Base", hex: baseHex },
          { label: "Lighten(0.3)", hex: lighterColor },
          { label: "Darken(0.3)", hex: darkerColor },
        ].map(({ label, hex }) => (
          <Box
            key={label}
            sx={{
              width: 100, height: 100, bgcolor: hex, borderRadius: 2,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", border: "2px solid #ccc",
            }}
            onClick={() => copyToClipboard(hex)}
          >
            <Typography variant="caption" sx={{ color: "#fff", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography>Base: {baseHex}</Typography>
        <Typography>Lighten(0.3): {lighterColor}</Typography>
        <Typography>Darken(0.3): {darkerColor}</Typography>
      </Box>
    </Box>
  );
};

export default App;