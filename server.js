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

    //==================================================Login==================================================
    socket.on('getSalt', user => {
        parseJSON("./data.json", (data) => {

            const salt = () => {
                for(let e of data.userdata){ //ToDo: - Gucken das passwort und username auf den gleichen Salt zutreffen
                    if(e.name === user){     //      - Alle Listener verketten (nicht ineinander vllt. mit then() und Promises)
                        return e.salt;
                    }
                }
                return false
            }
            socket.emit('salt', salt());

            if(salt() != false){
                socket.on('login', loginData => {
                    //console.log(loginData)
                    for(let e of data.userdata){
                        if(e.name === loginData.user){
                            if(loginData.user === e.name && loginData.pass === e.password){
                                console.log("Eingelogt als " + e.name)
                                socket.emit('succesfullLogin', true)
                            }else{
                                socket.emit('succesfullLogin', false)
                            }
                        }
                    }
                })
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
                json['userdata'].push({"name":data.user,"salt":salt,"password":data.pass})
                //console.log(json)
                writeJSON('./data.json', json)
                socket.emit('succesfullRegister', true)
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




