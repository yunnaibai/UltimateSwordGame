const socket = io()

let loginUsername = document.getElementById("user")
let loginPassword = document.getElementById("pass")
let registerUsername = document.getElementById("user1")
let registerPassword = document.getElementById("pass1")
let registerPasswordAgain = document.getElementById("pass2")

//==================================================Login==================================================
const login = () => {
    socket.emit("getSalt", hash(loginUsername.value))
}
socket.on("salt", (salt) => {
    if(salt !== false){
        var login = {
            pass: hash(loginPassword.value + salt),
            user: hash(loginUsername.value)
        }
        socket.emit("login",login)
    }else{
        displayError();
    }
})
socket.on('succesfullLogin', (para) =>{
    if(para){
        displayCorrect()
        //location.href = "./game.html";
    }else{
        displayError()
    }
})
//==================================================Registrien==================================================
const register = () => {
    if(registerPassword.value === registerPasswordAgain.value && registerUsername.value !== "" && registerPassword.value !== "" && registerPasswordAgain.value !== ""){
        socket.emit("generateSalt", hash(registerUsername.value))
    }else{
        displayError();
    }
}
socket.on("firstSalt", (salt) => {
        
    var register = {
        pass: hash(registerPassword.value + salt),
        user: hash(registerUsername.value),
        salt: salt
    }
    if(salt !== false){
    socket.emit("register", register)
    console.log("User noch nicht existent")
    }else{
        displayError();
    }
})
socket.on("succesfullRegister", (para) => {
    if(para == true){
        displayCorrect();
    }else{
        displayError();
    }
})  

const hash = input => CryptoJS.SHA512(input).toString()

const displayError = () => {
    displayMoveDiv();
    document.getElementById("content").style.setProperty("--gradient-main-color", "#E50030");
    document.getElementById("content").style.setProperty("--gradient-second-color", "#E50030");
    setTimeout(() => {
        displaySetDefault()
    }, 500)
}
const displayCorrect = () => {
    displayMoveDiv();
    document.getElementById("content").style.setProperty("--gradient-main-color", "#54af48");
    document.getElementById("content").style.setProperty("--gradient-second-color", "#54af48");
    setTimeout(() => {
        displaySetDefault()
    }, 500)
}
const displaySetDefault = () =>{
    document.getElementById("content").style.setProperty("--gradient-main-color", "#ff5e4100");
    document.getElementById("content").style.setProperty("--gradient-second-color", "#ff5e4100");
    document.getElementById("content").style.setProperty("--div-width", "104%");
    document.getElementById("content").style.setProperty("--div-height", "104%");
    document.getElementById("content").style.setProperty("--div-top", "-2%");
    document.getElementById("content").style.setProperty("--div-left", "-2%");
}
const displayMoveDiv = () => {
    let divWidth = 95.0;
    let divHeight = 96.0;
    let divTop = 2.0;
    let divLeft = 2.5;

    
    let i = 0;
    let j = setInterval(() => {
        divWidth+=0.4;
        divHeight+=0.4;
        divTop-=0.2;
        divLeft-=0.2;
        document.getElementById("content").style.setProperty("--div-width", `${divWidth}%`);
        document.getElementById("content").style.setProperty("--div-height", `${divHeight}%`);
        document.getElementById("content").style.setProperty("--div-top", `${divTop}%`);
        document.getElementById("content").style.setProperty("--div-left", `${divLeft}%`);
        i++;
        if(i > 15){
            clearInterval(j)
        }
    }, 40)
}
