const express =require("express");
const app=express();
const path = require("path");
const http =require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const cors=require("cors");

const PORT=process.env.PORT||3000;

app.set("view engine","ejs");
app.set(express.static(path.join(__dirname,'public')))
app.use(express.static("public"));
app.use(cors())

io.on("connection",function(socket){
    // console.log("a user connected");
    socket.on("send-location",function(data){
        io.emit("receive-loaction",{
            id:socket.id,
            ...data
        });
    });
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
    });
});



app.get("/",function(req,res){
    res.render("index");
});
server.listen(PORT,()=>"server started");