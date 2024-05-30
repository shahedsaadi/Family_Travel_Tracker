# Overview:
The Family Travel Tracker website helps you monitor your family’s travel history. Instead of using a scratchable world map, this website tracks which countries you’ve visited and displays them on a world map. You can add family members like your husband, son, and daughter, and keep a record of everyone's travels. 

The interface shows the total number of countries visited and provides a visual representation of the travels on a map.

# Technology Stack:
- HTML5.
- CSS.
- JavaScript.
- EJS.
- Node.js.
- Express.js.
- PostgreSQL.

# Visit The Website:
- Click on the link: https://family-travel-tracker-3rd2.onrender.com/

# To Run The Project:
- Create your Database you can name it any name, then take the Schema Definition from query.sql file.
- Clone the repository, inside the terminal (git clone https://github.com/shahedsaadi/Family_Travel_Tracker.git).
- Run npm install

  *-* After finishing the previous steps you need to follow the next instructions to complete the steps of running the project locally:

- Delete this part of the code that is the DB connection inside index.js file:

```javascript
const { Pool } = pg;
let connString = process.env.DATABASE_URL;
const db = new Pool({
  connectionString: connString,
  ssl: {
    rejectUnauthorized: false,
  },
});
```

- Replace it with this inside index.js:
```javascript
const db = new pg.Client({
  user: 'your_database_user',
  host: 'your_database_host',
  database: 'your_database_name', // For example family_travel
  password: 'your_database_password',
  port: your_database_port,
});
```
  - Run node index.js
  - Visit the link http://localhost:3000/


# Website Screenshot:
The homepage of the Family Travel Tracker website allows you to:

- Add a New Country: Enter the country's name in the input field and click "ADD" to mark it on the map.
- Select Another User: Click on the names (e.g., Angela, Jack, Shahed) to view and manage each family member’s travel history and add a new country as well.
- Add a New Family Member: Click "Add Family Member" to include a new user in the travel tracking list.
  
![travel](https://github.com/shahedsaadi/Family_Travel_Tracker/assets/108287237/18892b9e-0332-49d2-aed7-cd71752a96d1)

Write the new member's name, select a color, and press the "ADD" button.

![ali](https://github.com/shahedsaadi/Family_Travel_Tracker/assets/108287237/7a3d50c6-f4d1-4f79-a6ce-167235cc2e95)


![l](https://github.com/shahedsaadi/Family_Travel_Tracker/assets/108287237/ba8efd4a-17fb-4165-b7cf-a5cf2b103b0e)
