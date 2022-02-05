const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const bcrypt = require('bcrypt')
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
app.post('/salt', (req, res) => {
    console.log(req.body)
    parseJSON("./data.json", (data) => {


        const salt = async () => {
            //console.log(req.body.username)
            if(isEmptyObject(req.body.username)){
                return false
            }
            for(let e of data.userdata){
                if(e.name === req.body.username){
                    return e.salt;
                }
            }
            console.time("salt")
            const newSalt = await bcrypt.genSalt()
            console.timeEnd("salt")
            return newSalt
        }

        
        salt().then((salt) => {
            if(salt != false){
            res.status(200).send({salt: salt}) 
            }else{
                res.sendStatus(404)
            }
        })
    })
})

app.post('/login', (req, res) => {
    parseJSON("./data.json", (data) => {
        const login = () => {
            for(let e of data.userdata){
                console.log(req.body.username, " = ", e.name)
                console.log(req.body.password, " = ", e.password)
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
                    return {token: e.access_token}
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

app.get('/authenticate', (req, res) => {
    parseJSON("./data.json", (data) => {
        const authenticate = () => {
            for(let e of data.userdata){
                if(e.access_token == req.body.access_token){
                    console.log(e.expiration, new Date())
                    return true;
                    //Expiration abfrage
                    
                }
            }
            return false 
        }
    if(authenticate() != false){
        res.status(200).send(authenticate())
    }else{
    res.sendStatus(403)
    }
    })
    
})

app.post('/register', (req, res) => {
    parseJSON('./data.json', (data) => {
        const searchJSONonDups = () => {
            for(let e of data.userdata){
                if(e.name === req.body.username){
                    return false
                }
            }
            return true
        }
        if(searchJSONonDups() === true){
            data['userdata'].push({"name":req.body.username,"salt":req.body.salt,"password":req.body.pass})
            writeJSON("data.json", data)
            res.status(200).send(true)
            console.log(`[Register] User: ${data.user} hinzugefügt`)
        }else{
            res.sendStatus(403)
        }
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

const isEmptyObject = (obj) => !Object.keys(obj).length