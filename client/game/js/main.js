import {Box} from "./objects/Player.js"
import {clearCanvas} from "./canvas.js"
import {timer} from "./Timer.js"
import {levelSize} from "./Level.js"
import {Players} from "./objects/PlayerHandler.js"
import auth from "../../auth.js"

const socket = io();

if(!await auth()) window.location.href = window.location.href.replace("/game", "")

document.getElementById("canvas").setAttribute("width", levelSize[0])
document.getElementById("canvas").setAttribute("height", levelSize[1])

const clientPlayer = new Box({
    pos: [100, 100],
    size: [50, 50],
    color: "red",
    name: localStorage.getItem("username"),
    physics: true
})

clientPlayer.joinServer(socket)

const players = new Players(socket)

timer.update = (deltaTime) => 
{
    //console.log(Math.round(deltaTime * 100) / 100)
    //i++
    //if(i%60 == 0){ // 1/6sec
    clientPlayer.sendClientData(socket)
    //}

    clearCanvas()
    clientPlayer.update(deltaTime)
    clientPlayer.inLevelBounds()
    clientPlayer.move()
    clientPlayer.draw()

    players.updatePlayers(deltaTime)
}

timer.start()
