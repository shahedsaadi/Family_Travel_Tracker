import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config';

const { Pool } = pg;
let connString = process.env.DATABASE_URL;
const db = new Pool({
  connectionString: connString,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
.then(() => {
  console.log('Connected to the database');
})
.catch(err => {
  console.error('Database connection error:', err.stack);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

// users array, I can make it an empty array, the inputs help to visualize the structure of the users table from DB.
let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisited() {
  const result = await db.query(  //many : 1 relatioship,     PK = FK
    "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1;" ,
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {      //result.rows it's an array and inside it there're objects
    countries.push(country.country_code); //countries=["FR","US","GB"]
  });
  //  console.log(result.rows);
  return countries;
};

async function getCurrentUser(){
  const result = await db.query("SELECT * FROM users");
  users = result.rows;  // updated the users array with what's stored data in DB.
  return users.find((user)=> user.id == currentUserId);
};

// GET home page
app.get("/", async (req, res) => {
  const countries = await checkVisited();
  const currentUser = await getCurrentUser();

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser.color,
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getCurrentUser(currentUserId);

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    if (result.rows.length === 0) {
      throw new Error("Country not found");
    }

    const countryCode = result.rows[0].country_code;

    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      if (err.code === '23505') {  // Unique violation error code in PostgreSQL
        const countries = await checkVisited(currentUserId);
        res.render("index.ejs", {
          countries: countries,
          total: countries.length,
          users: users,
          color: currentUser.color,
          error: "Country has already been added, try again.",
        });
      } else {
        console.error("Database error:", err);
        res.status(500).send("Internal server error");
      }
    }
  } catch (err) {
    const countries = await checkVisited(currentUserId);
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: currentUser.color,
      error: "Country name does not exist, try again.",
    });
  }
});


app.post("/user", async (req, res) => {
  if(req.body.add === "new"){  //user hits the (Add Family Member) button.
    res.render("new.ejs");  
  } else {
    currentUserId = req.body.user; //user id it could be 1,2,3 and will update the currentUserId var.
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const name = req.body.name;
  const color = req.body.color;

  const result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *;",
  [name, color]
  );
  const id = result.rows[0].id; // id of the new user that has added in a serial way.
  // console.log(result.rows[0].id); new user id has added
  currentUserId = id;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
