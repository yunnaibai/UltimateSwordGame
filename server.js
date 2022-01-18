const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io');
const crypto = require('crypto')
const console = require('console');
const PORT = process.env.PORT || 8080; //Für Heroku

const app = express()
const server = http.createServer(app)
const io = socketio(server);

//Databse xD
var password;
var username;
var salt;


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
        socket.emit('salt', salt);

        socket.on('login', data => {
            console.log("   User versucht einzuloggen")
            console.log("   Password&Salt(Hash): " + password)
            console.log("   Username(Hash): " + username)
            if(data.user == username && data.pass == password){
                console.log("Eingelogt!")
            }
        })
    })
    socket.on('generateSalt', user => {
        salt = crypto.randomBytes(16).toString('hex')
        username = user
        console.log("Username(Hash): " + username)
        //Name und Salt in Datenbank eintragen
        socket.emit('firstSalt', salt);
        console.log("Salt: " + salt)
        socket.on('register', data => {
            password = data.pass 
            console.log("Password&Salt(Hash): " + data.pass)
        })
    })
})

