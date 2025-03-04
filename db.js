const Pool = require("pg").Pool;
const pool = new Pool({
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

module.exports = pool;
