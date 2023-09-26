const express = require("express");
const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",(req,res)=>{

   
    const data = { title:"Home"};
    res.render("home", data);
        
    });



app.listen(3000, ()=>{
    console.log('server started')
});
