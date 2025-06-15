import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
// Shim __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("env Path:", resolve(__dirname, "../.env"));
dotenv.config({ path: resolve(__dirname, "../.env") });
import express, { Request, Response } from "express";

const app = express();

const PORT = process.env.PORT ?? 3000;
app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
if (!TMDB_ACCESS_TOKEN) {
  throw new Error(
    "TMDB ACCESS TOKEN is missing from the environment variables."
  );
}

app.get("/", async (_, res) => {
  res.json({ message: "Server is running properly." }).status(200);
});

app.get("/discover/movie", async (_, res) => {
  const url =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return res
      .json({ data: result, success: true, message: "Call Succeeded" })
      .status(200);
  } catch (error) {
    return res
      .json({ message: JSON.stringify(error), success: false, data: null })
      .status(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running successfully at: http://localhost:${PORT}`);
});
