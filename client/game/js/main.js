import {Box} from "./objects/Box.js"
import {clearCanvas} from "./canvas.js"
import {timer} from "./Timer.js"
import {levelSize} from "./Level.js"

import auth from "../../auth.js"

const socket = io();

if(!await auth()) window.location.href = window.location.href.replace("/game", "")

document.getElementById("canvas").setAttribute("width", levelSize[0])
document.getElementById("canvas").setAttribute("height", levelSize[1])

const box = new Box({
    pos: [100, 100],
    size: [100, 100],
    color: "red"
})

socket.on("players", (data) => {
    console.log("data:", data)
})


let i = 0;

timer.update = (deltaTime) => 
{
    //console.log(Math.round(deltaTime * 100) / 100)
    i++
    if(i%10 == 0){
        socket.emit("player", {pos: box.pos, name: localStorage.getItem("username")})
    }

    clearCanvas()
    box.update(deltaTime)
    box.inLevelBounds()
    box.move()
    box.draw()
}

timer.start()
