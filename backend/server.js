import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import authRoutes from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const creds = JSON.parse(
  await readFile(join(__dirname, "./trip-expenses-57b012e0ba05.json"), "utf8")
);

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

const jwt = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: SCOPES,
});

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;

// Initialize Google Sheets document
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt);

// Endpoint to add expense
app.post("/api/expenses", authenticateToken, async (req, res) => {
  try {
    const { amount, description, category, date, currency, participants } =
      req.body;

    // Load the document
    await doc.loadInfo();

    // Get the first sheet
    const sheet = doc.sheetsByIndex[0];

    // Add the expense row
    await sheet.addRow({
      Timestamp: Date.now(),
      Categoria: category,
      Participantes: participants,
      Valor: amount,
      Date: date,
      Notas: description,
      Moeda: currency,
    });

    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
