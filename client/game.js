const socket = io()


const content = document.getElementById("content")
const loginUsername = document.getElementById("user")
const loginPassword = document.getElementById("pass")
const registerUsername = document.getElementById("user1")
const registerPassword = document.getElementById("pass1")
const registerPasswordAgain = document.getElementById("pass2")

let mainColor = "#ff5e80"
const correctColor = "#54af48"
const errorColor = "#E50030"
const transparentColor = "#00000000"

let blocked = false



const randomMainColor = () => {
    let rnd = Math.floor(Math.random() * 5)
    switch(rnd.toString()){
        case "0":
            mainColor = "#ff5e80"
        break
        case "1":
            mainColor = "#D91E34"
        break
        case "2":
            mainColor = "#7BB570"
        break
        case "3":
            mainColor = "#7E22F0"
        break
        case "4":
            mainColor = "#23A6DE"
        break
    }
}

randomMainColor()
document.documentElement.style.setProperty('--main-color', mainColor);

const login = () => {
    fetch("http://192.168.178.27:8080/salt/", {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            username: loginUsername.value
        })
    })
    .then(res => {
        if(!res.ok){
            return {salt: false}
        }else{
            return res.json().salt
        }
    }).then((salt) => {
        fetch("http://192.168.178.27:8080/login/", {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                username: loginUsername.value,
                password: loginPassword.value
                //Salt in den hash einrechnen
            })
        }).then((res) => {
            if(res.ok){
                displayCorrect()
                return res.json()
            }else{
                displayError()
            }
        }).then((data) => {
            if(data)
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", loginUsername.value);
        })
    })
}

const register = () => {
    fetch("http://192.168.178.27:8080/salt/", {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            username: loginUsername.value
        })
    })
    .then(res => {
        if(!res.ok){
            return {salt: false}
        }else{
            return res.json()
        }
    }).then(data => {
        return data.salt
    })
}

const authenticate = () => {
    if(localStorage.getItem("token") == null || localStorage.getItem("username") == null) return false
    fetch("http://192.168.178.27:8080/authenticate/", {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            username: localStorage.getItem("username"),
            access_token: localStorage.getItem("token")
        })
    }).then((res) => {
        if(res.ok){
            console.log("Eingelogt")
            return true
        }
        return false
    })
}
authenticate()

/*
//==================================================Login==================================================
const login = () => {
    if(blocked == false){
        if(loginUsername.value !== "" && loginPassword.value !== ""){
            socket.emit("getSalt", hash(loginUsername.value))
        }
    }
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
    if(blocked == false){
        if(registerPassword.value === registerPasswordAgain.value && registerUsername.value !== "" && registerPassword.value !== "" && registerPasswordAgain.value !== ""){
            socket.emit("generateSalt", hash(registerUsername.value))
        }
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
*/


const hash = input => CryptoJS.SHA512(input).toString()

const displayError = () => {
    blocked = true
    displayFakeLoading()
    setTimeout(() => {
        displayMoveDiv();
        content.style.setProperty("--gradient-main-color", errorColor);
        content.style.setProperty("--gradient-second-color", errorColor);
        setTimeout(() => {
            displaySetDefault()
        }, 500)
        blocked = false
    }, 2000)
    
}
const displayCorrect = () => {
    blocked = true
    displayFakeLoading()
    setTimeout(() => {
        displayMoveDiv();
        content.style.setProperty("--gradient-main-color", correctColor);
        content.style.setProperty("--gradient-second-color", correctColor);
        setTimeout(() => {
            displaySetDefault()
        }, 500)
        blocked = false
    }, 2000)
    
}
const displaySetDefault = () =>{
    content.style.setProperty("--gradient-main-color", transparentColor);
    content.style.setProperty("--gradient-second-color", transparentColor);
    content.style.setProperty("--div-width", "104%");
    content.style.setProperty("--div-height", "104%");
    content.style.setProperty("--div-top", "-2%");
    content.style.setProperty("--div-left", "-2%");
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
        content.style.setProperty("--div-width", `${divWidth}%`);
        content.style.setProperty("--div-height", `${divHeight}%`);
        content.style.setProperty("--div-top", `${divTop}%`);
        content.style.setProperty("--div-left", `${divLeft}%`);
        i++;
        if(i > 15){
            clearInterval(j)
        }
    }, 40)
}
const displayFakeLoading = () => {
    content.style.setProperty("--gradient-main-color", mainColor);
    content.style.setProperty("--gradient-second-color", transparentColor);
    content.style.setProperty("--div-width", "95%");
    content.style.setProperty("--div-height", "96%");
    content.style.setProperty("--div-top", "2%");
    content.style.setProperty("--div-left", "2.5%");
}

