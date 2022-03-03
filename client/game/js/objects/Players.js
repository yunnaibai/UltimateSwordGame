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
    searchAdded(serverData, clientPlayers){
        if(serverData.length > clientPlayers.length){
            let output = []
            //console.log("serverData ist größer")
            let bool = false
            for(let i of serverData){
                //if(i.name == localStorage.getItem("username")) return
                //console.log(i)
                bool = false
                for(let j of clientPlayers){
                    if(i.name == j.name){
                        bool = true
                        break
                    }
                }
                if(!bool){
                    output.push(i)
                }
            }
            return output
        }else if(serverData.length < clientPlayers.length){
            console.log("spieler weniger => entferne aus Liste")
        }
    }

    addPlayer(pos, name){
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
        //console.log(this.players)
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
        if(this.players.length < data.length){
            this.searchAdded(data, this.players).forEach(e => {
                this.addPlayer(e.pos, e.name)
                
            })
            //this.addPlayer(this.searchAdded(data, this.players).pos, this.searchAdded(data, this.players).name)
        }
    }
    

    updatePlayers(deltaTime){
        if(this.players.length == 0){
            console.log("no players")
            return
        } 
        //console.log(this.players)
        for(let player of this.players){
            //console.log("update:", player.name)
            //player.update(deltaTime) keine berechnung keine bewegung easy
            player.draw()
            player.inLevelBounds()
        }
    }
}