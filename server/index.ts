import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Shim __filename and __dirname
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

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

app.get("/", async (_, res: Response) => {
  res.json({ message: "Server is running properly." }).status(200);
});

app.get("/search/movie", async (req: Request, res: Response) => {
  const query = req.query.query as string;
  if (!query) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Missing `query` parameter",
        data: null,
      });
  }

  const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&query=${encodeURIComponent(
    query
  )}`;
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
      .status(200)
      .json({ success: true, message: "Call Succeeded", data: result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: (err as Error).message });
  }
});

app.get("/discover/movie", async (_, res: Response) => {
  const url =
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc";
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
