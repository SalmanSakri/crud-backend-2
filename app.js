// const express = require("express");
// const { Pool } = require("pg");
import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 500;

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "salman",
  password: "Raju",
  port: "5432",
});

pool.connect((err) => {
  if (err) {
    console.log("error on db");
  } else {
    console.log("connect db");
  }
});

// Put a user start
app.post("/postData", async (req, res) => {
  const { taskName, status, description, startDate, endDate } = req.body;
  const insert_query =
    'INSERT INTO demotable ("taskName", status, description, "startDate", "endDate") VALUES ($1, $2, $3, $4, $5) RETURNING * ';

  try {
    pool.query(
      insert_query,
      [taskName, status, description, startDate, endDate],
      (err, result) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          console.log(result);
          res.json({ message: "Task added successfully!" });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});
// Put a user end

// Get a user start
app.get(`/fetchData`, (req, res) => {
  const fetch_query = "SELECT * from demotable";

  try {
    pool.query(fetch_query, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result.rows);
      }
    });
  } catch (err) {}
});
// Get a user end

// Get a single user start
app.get("/fetchDataId/:id", (req, res) => {
  const id = req.params.id;
  const id_fetch_query = "SELECT * from demotable where id = $1";

  try {
    pool.query(id_fetch_query, [id], (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result.rows[0]);
      }
    });
  } catch (err) {}
});
// Get a single user end

// update user by id start

app.put(`/update/:id`, async (req, res) => {
  const id = req.params.id;
  const { taskName, status, description, startDate, endDate } = req.body;

  const update_query =
    'UPDATE demotable SET "taskName"=$1, "status"=$2, "description"=$3, "startDate"=$4, "endDate"=$5 WHERE id=$6 RETURNING *';

  try {
    const result = await pool.query(update_query, [
      taskName,
      status,
      description,
      startDate,
      endDate,
      id,
    ]);

    if (result.rowCount > 0) {
      res.json({ message: "Task updated successfully!", task: result.rows[0] });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update user by id end

// delete user start
app.delete(`/delete/:id`, (req, res) => {
  const id = req.params.id;
  const delete_query = "DELETE from demotable WHERE id=$1";

  try {
    pool.query(delete_query, [id], (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  } catch (err) {}
});

app.get("/", (req, res) => {
  res.send("Hello, Geeks!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.get("/user/:id", async (req, res) => {
//   const { id } = req.params;
//   const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
//   res.json(user.rows[0]);
// });

// // Update a user
// app.put("/user/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, email } = req.body;
//   await pool.query(
//     "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
//     [name, email, id]
//   );
//   res.json({ message: "User updated" });
// });

// // Delete a user
// app.delete("/user/:id", async (req, res) => {
//   const { id } = req.params;
//   await pool.query("DELETE FROM users WHERE id = $1", [id]);
//   res.json({ message: "User deleted" });
// });
