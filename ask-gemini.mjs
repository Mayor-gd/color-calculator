import { GoogleGenAI } from "@google/genai";

// 1. Your API Key is plugged in here
const GEMINI_API_KEY = "AIzaSyDrt8H56Cfx46k2t_bYr0Sdw8ggmKKT1j4"; 

// 2. Grab the color code you type in the terminal
const colorInput = process.argv[2] || "007BFF"; 

async function run() {
  // Safe validation check
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_REAL_API")) {
    console.log("❌ Error: Please paste your actual Gemini API key inside the script file!");
    return;
  }

  console.log(`🤖 Asking Gemini about color: #${colorInput}...`);

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Give a quick, one-sentence psychological profile or mood description for the hex color code #${colorInput}.`,
    });

    console.log("\n💬 Gemini Says:");
    console.log(`==================================================`);
    console.log(`${response.text.trim()}`);
    console.log(`==================================================\n`);

  } catch (error) {
    console.error("❌ Failed to connect to Gemini:", error.message);
  }
}

run();