const loginUsername = $('#user')
const loginPassword = $('#pass')
const registerUsername = $('#user1')
const registerPassword = $('#pass1')
const registerPasswordAgain = $('#pass2')

let mainColor = "#ff5e80"
let correctColor = "#54af48"
let errorColor = "#E50030"
let transparentColor = "#00000000"

let blocked = false

$(document).ready( async() => {
    randomMainColor()
    if(await authenticate()){
        console.log(true)
        window.location.replace("game");
    }
});


const login = () => {
    console.log(loginUsername.val(), loginPassword.val())
    fetch(`${window.location.href}salt/`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            username: loginUsername.val()
        })
    })
    .then(res => {
        if(!res.ok){
            return {salt: false}
        }else{
            return res.json()
        }
    }).then((data) => {
        fetch(`${window.location.href}login/`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                username: loginUsername.val(),
                password: hash(data.salt + loginPassword.val())
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
            localStorage.setItem("username", loginUsername.val());
        })
    })
}

const register = () => {
    fetch(`${window.location.href}salt/`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            username: registerUsername.val()
        })
    })
    .then(res => {
        if(!res.ok){
            console.log("res: false")
            return {salt: false}
        }else{
            console.log("try to read json")
            return res.json()
            //Salt will nich idk why????
        }
    }).then(data => {
        console.log(data.salt)
        fetch(`${window.location.href}register/`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                username: registerUsername.val(),
                password: hash(data.salt + registerPassword.val()),
                salt: data.salt
            })
        }).then((res) => {
            if(!res.ok) return false
            return res.json()
        }).then((data) => {
            console.log(data)
        })
    })
}

function authenticate(){
    if(localStorage.getItem("token") == null || localStorage.getItem("username") == null) return false
    return fetch(`${window.location.href}authenticate/`, {
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
            return true
        }
        return false
    }).catch(() => {
        console.log("Error fetch")
        return false
    })
}
const hash = input => CryptoJS.SHA512(input).toString()

const displayError = () => {
    blocked = true
    displayFakeLoading()
    setTimeout(() => {
        displayMoveDiv();
        $('#content').css("--gradient-main-color", errorColor)
        $('#content').css("--gradient-second-color", errorColor)
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
        $('#content').css("--gradient-main-color", correctColor)
        $('#content').css("--gradient-second-color", correctColor)
        setTimeout(() => {
            displaySetDefault()
        }, 500)
        blocked = false
    }, 2000)
    
}
const displaySetDefault = () =>{
    $('#content').css("--gradient-main-color", transparentColor);
    $('#content').css("--gradient-second-color", transparentColor);
    $('#content').css("--div-width", "104%");
    $('#content').css("--div-height", "104%");
    $('#content').css("--div-top", "-2%");
    $('#content').css("--div-left", "-2%");
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
        $('#content').css("--div-width", `${divWidth}%`);
        $('#content').css("--div-height", `${divHeight}%`);
        $('#content').css("--div-top", `${divTop}%`);
        $('#content').css("--div-left", `${divLeft}%`);
        i++;
        if(i > 15){
            clearInterval(j)
        }
    }, 40)
}
const displayFakeLoading = () => {
    $('#content').css("--gradient-main-color", mainColor);
    $('#content').css("--gradient-second-color", transparentColor);
    $('#content').css("--div-width", "95%");
    $('#content').css("--div-height", "96%");
    $('#content').css("--div-top", "2%");
    $('#content').css("--div-left", "2.5%");
}
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
    $(':root').css('--main-color', mainColor)
}
