const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const bcrypto = require('bcrypt')
const fs = require('fs')
const console = require('console')
const networks = require('os').networkInterfaces();

const PORT = process.env.PORT || 8080 //Für Heroku ?!Hosting Webside?!
const app = express()
const server = http.createServer(app)
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'client')))



//Start Server
server.listen(PORT, () => {
    console.log(`Webside: http://${getIPv4()}:${PORT}`)
})

//MIDDLEWARE
app.use(express.json())


//ROUTES
app.get('/salt', (req, res) => {
    parseJSON("./data.json", (data) => {

        //Abfrage ob body inhalt existent ist xD

        const salt = async () => {
            for(let e of data.userdata){
                if(e.name === req.body.username){
                    return e.salt;
                }
            }
            console.time("salt")
            const newSalt = await bcrypto.genSalt()
            console.timeEnd("salt")
            return newSalt
        }

        
        salt().then((salt) => {
            res.status(200).send(salt) 
        })
    })
})

app.post('/login', (req, res) => {
    parseJSON("./data.json", (data) => {
        const login = () => {
            for(let e of data.userdata){
                if(req.body.username === e.name && req.body.password === e.password){ //Compare funktion benutzten!!!
                    console.log("Eingelogt als " + e.name)
                    return "Login erfolgreich"
                }
            }
            return "Login fehlgeschlagen"
        }
        res.send(login())
    })
})



//Socket Client Request annehmen
/*
io.on('connection', socket => {
    console.log(`[Server] Client ${socket.id} ist zum Server connected`)
    socket.emit('welcome', "Verbindung zum Server wurde hergestellt!")
    //==================================================Login==================================================
    socket.on('getSalt', user => {
        parseJSON("./data.json", (data) => {

            const salt = () => {
                for(let e of data.userdata){
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
    //==================================================Registriren==================================================
    socket.on("generateSalt", user => {
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
                socket.emit('firstSalt', salt);
            }else{
                console.log("[Register] Username vergeben!")
                socket.emit('firstSalt', false);
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
*/

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

const getIPv4 = () => {
    //console.log(network)
    //Durchgehen der einzelnen Netzwerk Objekte
  for (var network in networks) {
    var j = networks[network]

    for (var i = 0; i < j.length; i++) {
      var q = j[i]
      if (q.family === 'IPv4' && q.address !== '127.0.0.1' && !q.internal)
        return q.address
    }
  }
  return '0.0.0.0'
}
