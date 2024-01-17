const {con}=require('../connection.js');
const path=require('path');

const update_=async (req,resp)=>{
    if(req.file){
        const doc_link=path.resolve(req.file.path); //for finding actual path of file
        const term=req.body.term;
        const year=req.body.year;
        const semester=req.body.semester;
        const branch=req.body.branch;

        let d=await con.awaitQuery('update pyqt set doc_link=? where year=? and term= ? and semester=? and branch =?',[doc_link,year,term,semester,branch]);
        if(d.affectedRows==0)
            resp.status(404).send('not found or not updated');
        else
            resp.status(200).json({message:"updated"});
        }
    else
        console.log("file has not come");
}






const delete_=async (req,resp)=>{
    // if(req.file){
        // const doc_link=path.resolve(req.file.path);
        const term=req.body.term;
        const year=req.body.year;
        const semester=req.body.semester;
        const branch=req.body.branch;

        let d=await con.awaitQuery('delete from pyqt where year=? and term= ? and semester=? and branch =?',[year,term,semester,branch]);
        if(d.affectedRows==0)
            resp.status(404).send('not found in database');
        else
            resp.status(200).send('deleted');
        // }
    // else
        // console.log("file has not come");
}





let post_=async (req,resp)=>{
    if(req.file){
        const doc_link=path.resolve(req.file.path);
        const term=req.body.term;
        const year=req.body.year;
        const semester=req.body.semester;
        const branch=req.body.branch;

        let d=await con.awaitQuery('insert into pyqt(year,term,semester,branch,doc_link) values(?,?,?,?,?)',[year,term,semester,branch,doc_link]);
        if(d.length==0)
            resp.status(404).send('error in inserting');
        else
            resp.status(200).send('inserted');
        }
    else
        console.log("file has not come");
}

const get_=async (req,resp)=>{
    const term=req.query.term;
    const year=req.query.year;
    const semester=req.query.semester;
    const branch=req.query.branch;

    const d=await con.awaitQuery('select doc_link from pyqt where year=? and term=? and semester=? and branch=?',[year,term,semester,branch]);
    if(d.length>0){
        resp.status(200).send(d[0]);
        console.log(d[0]);
    }
    else{
        resp.status(404).send('not found sir');
        console.log('not found sir');
    }

}

const post_R=async (req,resp)=>{
    const d= await [req.body.year,req.body.branch,req.body.semester,req.body.term,req.body.gmail];
    // const year=req.body.year;
    // const branch=req.body.branch;
    // const semester=req.body.semester;
    // const term=req.body.term;
    // const gmail=req.body.gmail;
    
    if(d.length==0){
        resp.send('data has not come');
        return;
    }

    const cc=await con.awaitQuery('insert into reg_students(year,branch,semester,term,gmail) values(?,?,?,?,?)',d);
    if(cc.length==0){
        resp.status(400).send('error in inserting');
    }
    else{
        resp.status(200).send('inserted');
    }

}

const get_R=async (req,resp)=>{
    const gmail=req.query.gmail;
    const d=await con.awaitQuery('select gmail from reg_students where gmail = ?',[gmail]);
    if(d.length==0){
        resp.status(400).json({message:"gmail not found PLEASE REGISTER FIRST SIR!!!"});
    }
    else{
        const da=new Date();
        const cur_year=da.getFullYear();    // for testing i put it 2011
        const cur_month=da.getMonth()+1;
        
        const branch=await con.awaitQuery('select branch from reg_students where gmail = ?',[gmail]);
        const year=await con.awaitQuery('select year from reg_students where gmail = ?',[gmail]);        
        const semester=await con.awaitQuery('select semester from reg_students where gmail = ?',[gmail]);
        const stu_branch=branch[0].branch;
        
        // resp.status(200).json({cur_year});
        // resp.status(200).json(year);
        // year=Number(year);
        const stu_year=year[0].year;                  //because it was comming like an object type
        // console.log(cur_year-stu_year);
        let stu_semester=semester[0].semester;
        // console.log(stu_semester);
        if((cur_year-stu_year)>=4){
            resp.status(400).json({message:"you have passed out from your college or gmail not found"});
            return;
        }

        let term;    
        if(cur_month >0 && cur_month <=3)
            term="mid-sem";
        else if(cur_month>3 && cur_month <=6)             
            term="end-sem";
        else if(cur_month>6 && cur_month<=9)
            term="mid-sem";                           /*       LOGIC PART               */
        else
            term="end-sem";

        let y_year=cur_year-1;
        stu_semester+=(2*(cur_year-stu_year));
        if(stu_semester %2 ==0){
            if(cur_month > 6)
                stu_semester+=1;  //by assuming 1 to 6 even sem else odd;  
        }
        else{
            if(cur_month <=6)
                stu_semester-=1;
        }
        if(stu_semester >8 || stu_semester <=0){
            resp.status(400).json({message:"semester invalid now"});  
            
        }


        // const dt=[y_year,stu_branch,stu_semester,term];
        console.log(dt);
        const link=await con.awaitQuery('select doc_link from pyqt where year=? and branch=? and semester=? and term=?',dt);
        if(link.length==0){
            resp.status(400).json({message:"not found sir"});
            return;
        }
        resp.status(200).json({link});
        return;


    }

}






const o11={
    post_,get_,post_R,get_R,delete_,update_
}

// module.exports={post_,get_,post_R,get_R};
module.exports=o11;
