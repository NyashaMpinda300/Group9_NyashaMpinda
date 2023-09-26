const data = require("./dummyData")
const express = require("express");

const app = express();
app.set("view engine","ejs");

app.use(express.static("public"));

app.get("/",(req,res)=>{

    const data = {data: rainfallData, data1: expensesData, data2: topRankedLanguages};
    res.render("index",data);     
    });

    // console.log(data.rainfallData)
    
app.listen(3000, ()=>{
    console.log('server started')
});