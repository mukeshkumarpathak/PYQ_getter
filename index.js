const {app}=require('./Routers/router.js');
const {con}=require('./connection.js');
const cron=require('node-cron');

// Define a cron job to delete records every day at midnight
cron.schedule('0 0 * * *', () => {
    // Perform the database cleanup here
    deleteRecords();
  });
  
// console.log(typeof(new Date().getFullYear()));  
  
function deleteRecords() {
    const deleteQuery = 'delete from reg_students where year <= ?';
    let c_D=new Date();
    let yeeear=c_D.getFullYear();
    let xc=yeeear-4;
    
    con.query(deleteQuery,[xc], (error, results) => {
      if (error) {
        console.error('Error deleting records:', error);
      } else {
        console.log('Records deleted successfully:', results.affectedRows);
      }
    });
  }



const port=process.env.PORT || 11501;
app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
})





