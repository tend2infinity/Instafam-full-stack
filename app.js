const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./Configuration/Keys')




mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo yeahhh")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})

require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/path'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('Client_side/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'Client_side','build','index.html'))
    })
}
app.listen(PORT, ()=> {
    console.log("app is running on",PORT)
})