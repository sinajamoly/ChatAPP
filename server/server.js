const path = require('path');
const express = require('express');


//checking the port
const port = process.env.PORT || 3000;

const app = express();
const publicPath = path.join(__dirname, '../public');

// MIDDLEWARES
app.use(express.static(publicPath));

// app.get('/',(req, res)=>{
//     res.send('hello world');
// });


app.listen(port, ()=>{
    console.log(`application is running on port ${port}`);
})