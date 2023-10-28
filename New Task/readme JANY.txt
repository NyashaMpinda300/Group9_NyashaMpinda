This is the school report system pon the assignment

1. localhost:3000/ -> index.ejs
2. localhost:3000/summary - > summary.ejs
3. localhost:3000/updateGrade -> updateGrade.ejs
4. localhost:3000/delete -> delete.ejs
5. localhost:3000/update -> update.ejs
6. localhost:3000/register -> RegisterStudent.ejs
7. localhost:3000/EnterResults -> EnterResults.ejs


run the project is: nodemon app.js

study the pages and style them accordingly

enter the urls above to view the pages individually

go to the styles.css

look for the following code below and style it , u will figure it out.

  // Render a simple HTML page with the data
    res.send(`
    <style>
      table {
        width: 80%;
        margin: 20px auto;
        border-collapse: collapse;
        font-size: 18px;
      }
      th, td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      th {
        background-color: #f2f2f2;
      }
      h1 {
        font-size: 24px;
      }
      h2 {
        font-size: 20px;
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
  