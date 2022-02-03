const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const bcrypto = require('bcrypt')
const crypto = require('crypto')

const fs = require('fs')
const console = require('console')
const networks = require('os').networkInterfaces();

const PORT = process.env.PORT || 8080 //Für Heroku ?!Hosting Webside?!
const app = express()
const server = http.createServer(app)
const io = socketio(server);

const ACCESS_TOKEN_SECRET = "61d562376435bf2bb33c209a38558d06f22af3022b5b7af42a551530b19040733b4f1b4cb928349123c0afd33712b75d72f72390d51edc73db3edf419c9a5621"
//Auslagern in z.B eine .env oder .json

app.use(express.static(path.join(__dirname, 'client')))



//Start Server
server.listen(PORT, () => {
    console.log(`Connection: http://${getIPv4()}:${PORT}`)
})

//console.log(crypto.randomBytes(64).toString("hex"))
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
                if(req.body.username === e.name && req.body.password === e.password){ 
                    console.log("Eingelogt als " + e.name)

                    const token = crypto.randomBytes(64).toString("hex") 
                    const currentDate = new Date().getTime()
                    const expire = currentDate + 1 * 60000
                    console.log(currentDate, expire)

                    e.expiration = expire
                    e.access_token = token
                    //console.log(e)
                    writeJSON('./data.json', data)
                    return e.access_token
                }
            }
            return false
        }
        if(login() != false){
            res.status(200).send(login())
        }else{
            res.sendStatus(403)
        }
        
    })
})

app.post('/authenticate', (req, res) => {
    
    const authenticate = () => {
        parseJSON("./data.json", (data) => {
            for(let e of data.userdata){
                if(e.access_token == req.body.access_token){
                    console.log("access: true")
                    if(e.expiration == req.body.expiration){
                        console.log("exp: true")
                        console.log("json/api: ", e.expiration, " = ", req.body.expiration)
                        console.log("json/api: ", e.access_token, " = ", req.body.access_token)
                        return true
                    }
                }
            }
        })
        return false
    }
    //console.log("output: ", authenticate())
    if(authenticate() != false){
        res.status(200).send(authenticate())
    }else{
        res.sendStatus(403)
    }
})

app.get('/register', (req, res) => {

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

const authenticateToken = (token) => {
    
}
 
