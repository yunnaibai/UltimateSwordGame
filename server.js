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
    console.log(`[Server] Client ${socket.id} ist zum Server connected`)
    socket.emit('welcome', "Verbindung zum Server wurde hergestellt!")

    //==================================================Login==================================================
    socket.on('getSalt', user => {
        parseJSON("./data.json", (data) => {

            const salt = () => {
                for(let e of data.userdata){ //ToDo: - Login machne dies das
                    if(e.name === user){
                        return e.salt;
                    }
                }
                return false
            }
            socket.emit('salt', salt())
            
        })
    })
    socket.on('login', loginData => {
        parseJSON("./data.json", (data) => {
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
    })
    //==================================================Registrien==================================================
    socket.on("generateSalt", user => {
        //wenn der user noch nicht eingetragen wurde
        parseJSON('./data.json', (json) => {
            const searchJSONonDups = () => {
                for(let e of json.userdata){
                    if(e.name === user){
                        return false
                    }
                }
                return true
            }

            if(searchJSONonDups() == true){
                var salt = crypto.randomBytes(16).toString('hex');
                socket.emit('salt', salt);
            }else{
                console.log("[Register] Username vergeben!")
                socket.emit('salt', false);
            }
        })
        
        
    })
    socket.on('register', data => {
        parseJSON('./data.json', (json) => {
            const searchJSONonDups = () => {
                for(let e of json.userdata){
                    if(e.name === data.user){
                        return false
                    }
                }
                return true
            }
            if(searchJSONonDups() === true){
                json['userdata'].push({"name":data.user,"salt":data.salt,"password":data.pass})
                writeJSON("data.json", json)
                socket.emit("succesfullRegister", true)
                console.log(`[Register] User: ${data.user} hinzugefügt`)
            }else{
                socket.emit("succesfullRegister", false)
            }
            
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




