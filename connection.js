const mysql=require('mysql-await');
const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'pyq'
})

con.connect((err)=>{
    if(err)
        console.log('connection error');
    else
        console.log("connected to database");
})

module.exports={con};




