const express=require('express');
const app=express();
app.use(express.json());
// const {post_,get_,post_R}=require('../Controllers/controller.js');
const o11=require('../Controllers/controller.js');
const {upload}=require('../multer.js');
//for pyq table
app.post('/pyq/givingLink',upload.single('pic'),o11.post_);
app.get('/pyq/takingLink',o11.get_);
app.delete('/pyq/deleteLink',o11.delete_);
app.put('/pyq/updateLink',upload.single('pic'),o11.update_);


//for reg_students table
app.post('/registered/givingData',o11.post_R);
app.get('/registered/takeDataByGmail',o11.get_R);


app.use('*',(req,resp)=>{            //for not url matching
    resp.send("url problem sir");
})
module.exports={app};


