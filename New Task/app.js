
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "school_system"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});


app.get("/", (req, res) => {

  res.render("index");

});

app.get("/EnterResults", (req, res) => {

  // Initialize an array to store studentIDs
  const studentIDs = [];

  // Query the database to retrieve studentIDs
  con.query("SELECT studentID FROM student", function (err, result, fields) {
    if (err) throw err;

    // Iterate through the result and extract studentIDs
    for (let i = 0; i < result.length; i++) {
      studentIDs.push(result[i].studentID);
    }

    console.log(studentIDs); // Output an array of studentIDs

    // Render a template with the studentIDs
    res.render("EnterResults", { data2: studentIDs });
  });

});

app.get("/register", (req, res) => {

  res.render("RegisterStudent");

});

app.get("/update", (req, res) => {


  // Initialize an array to store studentIDs
  const studentIDs = [];

  // Query the database to retrieve studentIDs
  con.query("SELECT studentID FROM student", function (err, result, fields) {
    if (err) throw err;

    // Iterate through the result and extract studentIDs
    for (let i = 0; i < result.length; i++) {
      studentIDs.push(result[i].studentID);
    }

    console.log(studentIDs); // Output an array of studentIDs

    // Render a template with the studentIDs
    res.render("update", { data2: studentIDs });
  });
});

app.get("/delete", (req, res) => {

  //const {student_id_grade} = req.body;
  console.log(req.body);

  // Initialize an array to store student IDs
  const studentIDs = [];

  // Query the database to retrieve student IDs
  con.query("SELECT studentID FROM student", function (err, result, fields) {
    if (err) throw err;

    // Iterate through the result and extract student IDs
    for (let i = 0; i < result.length; i++) {
      studentIDs.push(result[i].studentID);
    }

    // Initialize an array to store subjects
    const subjects = [];

    // Query the database to retrieve subjects for a specific studentID
    //const studentIDToMatch = student_id_grade; // Replace with the desired student ID

    con.query(`SELECT subject FROM grades`, function (err, result, fields) {
      if (err) throw err;

      // Iterate through the result and extract subjects
      for (let i = 0; i < result.length; i++) {
        subjects.push(result[i].subject);
      }

      // Render a template with both student IDs and subjects
      res.render("delete", { data2: studentIDs, subjects });
    });
  });
});

app.get("/updateGrade", (req, res) => {

  //const {student_id_grade} = req.body;
  console.log(req.body);

  // Initialize an array to store student IDs
  const studentIDs = [];

  // Query the database to retrieve student IDs
  con.query("SELECT studentID FROM student", function (err, result, fields) {
    if (err) throw err;

    // Iterate through the result and extract student IDs
    for (let i = 0; i < result.length; i++) {
      studentIDs.push(result[i].studentID);
    }

    // Initialize an array to store subjects
    const subjects = [];

    // Query the database to retrieve subjects for a specific studentID
    //const studentIDToMatch = student_id_grade; // Replace with the desired student ID

    con.query(`SELECT subject FROM grades`, function (err, result, fields) {
      if (err) throw err;

      // Iterate through the result and extract subjects
      for (let i = 0; i < result.length; i++) {
        subjects.push(result[i].subject);
      }

      // Render a template with both student IDs and subjects
      res.render("updateGrade", { data2: studentIDs, subjects });
    });
  });
});

app.get('/summary', (req, res) => {

  res.render("summary")

});

app.post('/summary', (req, res) => {
  const { studentID } = req.body;

  // Query the database to retrieve student grade data
  const query = `
    SELECT
      student.studentID,
      student.firstname,
      student.lastname,
      grades.subject,
      grades.gradeValue,
      grades.comment
    FROM student
    LEFT JOIN grades ON student.studentID = grades.studentID
    WHERE student.studentID = ?
  `;

  con.query(query, [studentID], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Database error');
      return;
    }

    if (results.length === 0) {
      // Student not found
      res.status(404).send('Student not found');
      return;
    }

    // Organize the data
    const studentData = {
      studentID: results[0].studentID,
      firstname: results[0].firstname,
      lastname: results[0].lastname,
      subjects: [],
      grades: [],
      comments: []
    };

    results.forEach(row => {
      studentData.subjects.push(row.subject);
      studentData.grades.push(row.gradeValue);
      studentData.comments.push(row.comment);
    });

    // Render a simple HTML page with the data
    res.send(`
    <style>
    @import url('https://fonts.googleapis.com/css?family=Inter');

      table {
        font-family: inter;
        width: 80%;
        margin: 20px auto;
        border-collapse: collapse;
        font-size: 14px;
      }
      th, td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
        padding: 1em;
      }
      th {
        background-color: #5c1ea3;
        color: white;
        padding: 1em;
      }
      h1 {
        font-family: inter;
        font-size: 24px;
        text-align: center;
        background-color: black;
        color: white;
        width: fit-content;
        margin-inline: auto;
        padding: 0.5em 2em;
        margin-block: 0;
        
      }
      h2 {
        text-align: center;
        font-family: inter;
        font-size: 18px;
        width: fit-content;
        margin-inline: auto;
        padding: 0.8em 2em;
        color: white;
        background-color: #5c1ea3;
      }
    </style>
    <h1>Student Summary</h1>
    <h2>${studentData.firstname} ${studentData.lastname} (Student ID: ${studentData.studentID})</h2>
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Grade</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        ${studentData.subjects.map((subject, index) => `
          <tr>
            <td>${subject}</td>
            <td>${studentData.grades[index]}</td>
            <td>${studentData.comments[index]}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `);



  });
});


app.get('/students', (req, res) => {
  // Query the database to retrieve a list of students
  con.query('SELECT * FROM student', (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Database error');
      return;
    }

    // Render the "StudentsList.ejs" template with the student data
    res.render('StudentsList', { students: results });
  });
});






app.post("/delete", (req, res) => {
  // Extract data from the request body
  const { student_id_grade, module } = req.body;
  console.log(req.body);

  // Perform the database deletion
  con.connect(function (err) {
    if (err) throw err;

    const sql = `
        DELETE FROM grades
        WHERE studentID = '${student_id_grade}' AND subject = '${module}'
      `;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Grade deleted successfully");

      // Redirect or send a response as needed
      res.redirect("/"); // Redirect to a students list page, for example
    });
  });
});


app.post('/updateGrade', (req, res) => {

  console.log("Post HAS ARRIVED");
  console.log(req.body);

  // Extract data from the request body
  const { student_id_grade, module, grade, comment } = req.body;

  // Perform the database update
  con.connect(function (err) {
    if (err) throw err;

    const sql = `
        UPDATE grades
        SET
          gradeValue = '${grade}',
          comment = '${comment}'
        WHERE studentID = '${student_id_grade}' AND subject = '${module}'
      `;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Grade data updated successfully");

      // Redirect or send a response as needed
      res.redirect('/students'); // Redirect to a students list page, for example
    });
  });

});

app.post('/update', (req, res) => {
  // Extract data from the request body
  const {
    first_name,
    last_name,
    date_of_birth,
    email,
    phone,
    address,
    city,
    state,
    zip_code,
    student_id_grade,
    major,
    enrollment_year
  } = req.body;

  // Perform the database update
  con.connect(function (err) {
    if (err) throw err;

    const sql = `
      UPDATE student
      SET
        firstname = '${first_name}',
        lastname = '${last_name}',
        \`D.O.B\` = '${date_of_birth}',
        email = '${email}',
        phone = '${phone}',
        address = '${address}',
        city = '${city}',
        country = '${state}',
        zipCode = '${zip_code}',
        major = '${major}',
        \`enrollment year\` = '${enrollment_year}'
      WHERE studentID = '${student_id_grade}'
    `;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");

      // Redirect or send a response as needed
      res.redirect('/students'); // Redirect to a students list page, for example
    });
  });
});


app.post('/register', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      email,
      phone,
      address,
      city,
      state,
      zip_code,
      student_id,
      major,
      enrollment_year,
    } = req.body;

    // Insert student data into the database
    await con.promise().query(
      'INSERT INTO student (studentID, firstname, lastname, `D.O.B`, email, phone, address, city, country, zipCode, major, `enrollment year`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        student_id,
        first_name,
        last_name,
        date_of_birth,
        email,
        phone,
        address,
        city,
        state,
        zip_code,
        major,
        enrollment_year,
      ]
    );

    console.log('1 record inserted');

    // Redirect or respond with a success message
    res.redirect('/students'); // Redirect to a students list page, for example
  } catch (error) {
    console.error('Error inserting student:', error);
    // Respond with an error message or redirect to an error page
    res.status(500).send('Internal Server Error');
  }
});



app.post('/EnterResults', (req, res) => {
  console.log("Post HAS ARRIVED");
  console.log(req.body);
  const { student_id, course, grade, comment } = req.body;

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    // Check if the record already exists
    const checkSql = `SELECT * FROM grades WHERE studentID = '${student_id}' AND subject = '${course}'`;

    con.query(checkSql, function (err, result) {
      if (err) throw err;

      if (result.length === 0) {
        // If the record doesn't exist, insert it
        const insertSql = `INSERT INTO grades (gradeValue, comment, subject, studentID) VALUES (
          '${grade}',
          '${comment}',
          '${course}',
          '${student_id}'
        )`;

        con.query(insertSql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");

          // Send a success response to the client
          res.status(200).send("Grade Entered Successfully");
        });
      } else {
        // If the record already exists, you can handle it here (e.g., send a response to the client)
        console.log("Record already exists");
        // You can send a response to the client indicating that the record already exists
        res.status(400).send("Record already exists");
      }
    });
  });
});





app.listen(3000, () => {
  console.log('server started')
});
