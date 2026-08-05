import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import Routes from "./routes";

//import pool from "./db";

//pool.connect()
//  .then(() => console.log("Database connected"))
//  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());
import path from "path";


app.use(
    "/uploads",
    express.static(
        path.join(__dirname,"../uploads")
    )
);

app.use("/api", Routes);

app.listen(5000, () => {
  
  console.log("Server running on http://localhost:5000");
});
