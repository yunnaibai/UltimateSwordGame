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
            console.log(data)
            this.addPlayer(data.pos, data.name)
        })
    }
    searchdupe = (array1, array2) => {

    }

    addPlayer(pos, name){
        //if(name == localStorage.getItem("username")) return
        const player = new Box({
            pos: pos,
            size: [50, 50],
            color: "blue",
            name: name,
            disableVel: false
        })
        this.players.push(player)
        //this.players.push(player)
        //Kommentar

        console.log(`Player ${name} added`)
        console.log(this.players)
    }

    delPlayer(name){
        //mach dlete xD
    }
    updatePosPlayers(data){
        if(this.players.length == data.length){
            for(let clientPlayer of this.players){
                for(let serverData of data){
                    if(clientPlayer.name == serverData.name){
                        clientPlayer.pos = serverData.pos
                        //console.log("pos updated")
                        break
                    }
                }
            }
        }
        if(this.players.length > data.length || this.players.length < data.length){
            console.log("player length error") //wenn jemand joined bevor man joined weiß der zweite das nich der muss es durch data erfahren wenn etwas dazu kommt bzw. weg geht
        }
    }
    

    updatePlayers(deltaTime){
        if(this.players.length == 0){
            console.log("no players")
            return
        } 
        //console.log(this.players)
        for(let player of this.players){
            console.log("update:", player.name)
            //player.update(deltaTime) keine berechnung keine bewegung easy
            player.draw()
            player.inLevelBounds()
        }
    }
}