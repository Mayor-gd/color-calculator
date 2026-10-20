import React, { useState } from "react";
import { 
  Box, Typography, TextField, IconButton, Stack, Paper, Snackbar, Alert 
} from "@mui/material";
import { WbSunny, Nightlight, ContentCopy } from "@mui/icons-material";

const hexToRgb = (hex) => {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return isNaN(num) ? { r: 0, g: 0, b: 0 } : {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

const rgbToHex = ({ r, g, b }) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
};

const lighten = (hex, amount) => {
  const { r, g, b } = hexToRgb(hex);
  const amt = parseFloat(amount) || 0;
  return {
    r: Math.min(255, r + (255 - r) * amt),
    g: Math.min(255, g + (255 - g) * amt),
    b: Math.min(255, b + (255 - b) * amt)
  };
};

const darken = (hex, amount) => {
  const { r, g, b } = hexToRgb(hex);
  const amt = parseFloat(amount) || 0;
  return {
    r: Math.max(0, r * (1 - amt)),
    g: Math.max(0, g * (1 - amt)),
    b: Math.max(0, b * (1 - amt))
  };
};

const App = () => {
  const [color, setColor] = useState("#6366F1");
  const [amount, setAmount] = useState(0.3);
  const [darkMode, setDarkMode] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const validHex = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#6366F1";
  const lightHex = rgbToHex(lighten(validHex, amount));
  const darkHex = rgbToHex(darken(validHex, amount));

  const baseRgb = hexToRgb(validHex);
  const lightRgb = hexToRgb(lightHex);
  const darkRgb = hexToRgb(darkHex);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setToastOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: darkMode ? "#0f172a" : "#f8fafc",
        color: darkMode ? "#f8fafc" : "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        transition: "background-color 0.3s, color 0.3s",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <Paper
        elevation={0}
        sx={{
          bgcolor: darkMode ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
          borderRadius: "24px",
          p: { xs: 3, md: 5 },
          maxWidth: 720,
          width: "100%",
          position: "relative",
          boxShadow: darkMode ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Theme Toggle */}
        <IconButton
          onClick={() => setDarkMode(!darkMode)}
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            bgcolor: darkMode ? "rgba(15, 23, 42, 0.6)" : "rgba(241, 245, 249, 0.8)",
            border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
            color: darkMode ? "#f8fafc" : "#0f172a",
            "&:hover": { borderColor: "#6366f1", transform: "scale(1.05)" }
          }}
        >
          {darkMode ? <WbSunny /> : <Nightlight />}
        </IconButton>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4, px: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
              background: darkMode 
                ? "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)" 
                : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Color Calculator
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
            Calculate shades, tints, and RGB values instantly
          </Typography>
        </Box>

        {/* Controls Grid */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <TextField
            label="HEX Color"
            variant="outlined"
            value={color}
            onChange={(e) => setColor(e.target.value.toUpperCase())}
            fullWidth
            inputProps={{ maxLength: 7 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: darkMode ? "rgba(15, 23, 42, 0.6)" : "rgba(241, 245, 249, 0.8)",
                color: darkMode ? "#f8fafc" : "#0f172a",
                "& fieldset": { borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" },
                "&:hover fieldset": { borderColor: "#6366f1" },
                "&.Mui-focused fieldset": { borderColor: "#6366f1" }
              },
              "& .MuiInputLabel-root": { color: darkMode ? "#94a3b8" : "#64748b" }
            }}
            InputProps={{
              endAdornment: (
                <input
                  type="color"
                  value={validHex}
                  onChange={(e) => setColor(e.target.value.toUpperCase())}
                  style={{
                    width: 30,
                    height: 30,
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    background: "transparent"
                  }}
                />
              )
            }}
          />

          <TextField
            label="Adjustment Amount"
            type="number"
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ step: 0.05, min: 0, max: 1 }}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: darkMode ? "rgba(15, 23, 42, 0.6)" : "rgba(241, 245, 249, 0.8)",
                color: darkMode ? "#f8fafc" : "#0f172a",
                "& fieldset": { borderColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" },
                "&:hover fieldset": { borderColor: "#6366f1" },
                "&.Mui-focused fieldset": { borderColor: "#6366f1" }
              },
              "& .MuiInputLabel-root": { color: darkMode ? "#94a3b8" : "#64748b" }
            }}
          />
        </Stack>

        {/* Swatches Grid */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ mb: 2 }}
        >
          {/* Lighter Box */}
          <Box
            onClick={() => handleCopy(lightHex)}
            sx={{
              flex: 1,
              bgcolor: darkMode ? "rgba(15, 23, 42, 0.6)" : "rgba(241, 245, 249, 0.8)",
              border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              borderRadius: "16px",
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
              "&:hover": { transform: "translateY(-4px)", borderColor: "#6366f1" }
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 110,
                bgcolor: lightHex,
                borderRadius: "12px",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <ContentCopy sx={{ color: "#fff", opacity: 0, transition: "opacity 0.2s", ".MuiBox-root:hover &": { opacity: 1 } }} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Lighter
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, mb: 0.5, color: "#818cf8" }}>
              {lightHex}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
              RGB({lightRgb.r}, {lightRgb.g}, {lightRgb.b})
            </Typography>
          </Box>

          {/* Base Box */}
          <Box
            onClick={() => handleCopy(validHex)}
            sx={{
              flex: 1,
              bgcolor: darkMode ? "rgba(15, 23, 42, 0.6)" : "rgba(241, 245, 249, 0.8)",
              border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              borderRadius: "16px",
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
              "&:hover": { transform: "translateY(-4px)", borderColor: "#6366f1" }
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 110,
                bgcolor: validHex,
                borderRadius: "12px",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <ContentCopy sx={{ color: "#fff", opacity: 0, transition: "opacity 0.2s", ".MuiBox-root:hover &": { opacity: 1 } }} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Base Color
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, mb: 0.5, color: "#818cf8" }}>
              {validHex}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
              RGB({baseRgb.r}, {baseRgb.g}, {baseRgb.b})
            </Typography>
          </Box>

          {/* Darker Box */}
          <Box
            onClick={() => handleCopy(darkHex)}
            sx={{
              flex: 1,
              bgcolor: darkMode ? "rgba(15, 23, 42, 0.6)" : "rgba(241, 245, 249, 0.8)",
              border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              borderRadius: "16px",
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
              "&:hover": { transform: "translateY(-4px)", borderColor: "#6366f1" }
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 110,
                bgcolor: darkHex,
                borderRadius: "12px",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <ContentCopy sx={{ color: "#fff", opacity: 0, transition: "opacity 0.2s", ".MuiBox-root:hover &": { opacity: 1 } }} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Darker
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, mb: 0.5, color: "#818cf8" }}>
              {darkHex}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
              RGB({darkRgb.r}, {darkRgb.g}, {darkRgb.b})
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Copy Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setToastOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', borderRadius: "10px", fontWeight: 600 }}
        >
          Copied {copiedText} to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
