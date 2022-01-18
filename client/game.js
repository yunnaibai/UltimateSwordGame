const socket = io()

let loginUsername = document.getElementById("user")
let loginPassword = document.getElementById("pass")
let registerUsername = document.getElementById("user1")
let registerPassword = document.getElementById("pass1")
let registerPasswordAgain = document.getElementById("pass2")
let salt;
let username;
let password;

const login = () => {
    username = hash(loginUsername.value)
    socket.emit("getSalt", username)
    socket.on("salt", (salt) => {
        if(salt !== "404"){
            console.log("Salt: " + salt)
            var login = {
                pass: hash(loginPassword + salt),
                user: username
            }
            socket.emit("login",login)
        }else{
            console.log("CSS verändern")
            document.getElementById("content").style.setProperty("--gradient-main-color", "#ff5e41");
            //document.getElementById("content").style.setProperty("--gradient-second-color", "#ffff00");
            //ToDo setInterval() und seTimeout()
            document.getElementById("content").style.setProperty("--div-width", "95%");
            document.getElementById("content").style.setProperty("--div-height", "96%");
            document.getElementById("content").style.setProperty("--div-top", "2%");
            document.getElementById("content").style.setProperty("--div-left", "2.5%");
        }
    })
    

}
const register = () => {
    console.log(registerUsername.value, registerPassword.value, registerPasswordAgain.value)
    username = hash(loginUsername.value)
    if(registerPassword.value === registerPasswordAgain.value){
        console.log("Passwörter sind gleich")
        socket.emit("generateSalt", username)
        console.log("Salt wurde angefragt")
        socket.on("firstSalt", (salt) => {
            console.log("Salt: " + salt)
            var register = {
                pass: hash(loginPassword + salt),
                user: username
            }
            console.log("Password&salt(Hash): " + register.pass)
            socket.emit("register", register)
        })
            
    }  
        
}

const hash = input => CryptoJS.SHA512(input).toString()
