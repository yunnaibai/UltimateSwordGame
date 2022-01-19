const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const crypto = require('crypto')
const fs = require('fs')

const PORT = process.env.PORT || 8080 //Für Heroku ?!Hosting Webside?!
//const users = require("./data.json")
const app = express()
const server = http.createServer(app)
const io = socketio(server);


app.use(express.static(path.join(__dirname, 'client')))
//console.log(path.join(__dirname, '..', 'client'));

//Start Server
server.listen(PORT, () => {
    console.log(`Hört dem Port ${PORT} zu!`)
    
    
})

//Socket Client Request annehmen
io.on('connection', socket => {
    console.log(`Client ${socket.id} ist zum Server connected`)
    socket.emit('welcome', "Verbindung zum Server wurde hergestellt!")

    socket.on('getSalt', data => {
        socket.emit('salt', "404");

        //ToDo .then(){}
        socket.on('login', data => {
            console.log("   User versucht einzuloggen")
            console.log("   Password&Salt(Hash): " + password)
            console.log("   Username(Hash): " + username)
            if(data.user == username && data.pass == password){
                console.log("Eingelogt!")
            }
        })
    })
    //==================================================Registrien==================================================
    socket.on("generateSalt", user => {
        //wenn der user noch nicht eingetragen wurde
        var salt = crypto.randomBytes(16).toString('hex');
        socket.emit('salt', salt);

        console.log("   Username: " + user)
        console.log("   Salt: " + salt)

        socket.on('register', data => {
            console.log("   Passwort: " + data.pass);

            parseJSON('./data.json', (json) => {
                json['user-data'].push({"name":data.user,"salt":salt,"password":data.pass})
                //console.log(json)
                writeJSON('./data.json', json)
            })

        })
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} ist disconnected`) 
      })
})


const parseJSON = (path, callback) => {
    fs.readFile(path, 'utf-8', (err, data) => {
        if(err){
            console.log(err)
            return null
            
        }else{
            try{
                const jsonData = JSON.parse(data)
                return callback(jsonData)
            }catch(err){
                console.log(err)
                return null
            }
        }
    })
}
const writeJSON = (path, data) =>{
    fs.writeFile(path, JSON.stringify(data, null, 2), (err) =>{
        if(err){
            console.log(err);
        }
    })
}


