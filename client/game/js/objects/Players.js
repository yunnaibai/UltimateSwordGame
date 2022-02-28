import {Box} from "./Box.js"
export class Players 
{
    constructor(socket){
        this.players = []
        this.socket = null
        socket.on("updatePlayers", (data) => {
            this.updatePosPlayers(data)
        })
        socket.on("playerJoin", (data) => {
            this.addPlayer(data.pos, data.name)
        })
    }


    addPlayer(pos, name){
        //if(player.name != localStorage.getItem("username")) return
        const player = new Box({
            pos: pos,
            size: [50, 50],
            color: "red",
            name: name
        })
        this.players.push(player)

        console.log(`Player ${name} added`)
    }

    delPlayer(name){

    }
    updatePosPlayers(data){
        this.players = data
    }
    

    updatePlayers(deltaTime){
        if(this.players.length == 0) return
        for(let player of this.players){
            player.update(deltaTime)
            player.inLevelBounds()
        }
    }
}