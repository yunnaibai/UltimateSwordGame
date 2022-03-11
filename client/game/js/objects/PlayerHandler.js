import {Box} from "./Player.js"
export class Players 
{
    constructor(socket){
        this.players = []
        this.socket = null
        socket.on("updatePlayers", (data) => {
            //console.log(data)
            this.updateVelPlayers(data)
        })
        socket.on("playerJoin", (data) => {
            //console.log(data)
            this.addPlayer(data.vel, data.name)
        })
        
    }
    
    searchAdded(serverData, clientPlayers){
        if(serverData.length > clientPlayers.length){
            let output = []
            let bool = false
            for(let i of serverData){
                bool = false
                for(let j of clientPlayers){
                    if(i.name == j.name){
                        bool = true
                        break
                    }
                }
                if(!bool) output.push(i)
            }
            return output
        }
    }
    searchRemoved(serverData, clientPlayers){
        if(serverData.length < clientPlayers.length){
            let output = []
            console.log("clientPlayers ist größer")
            let bool = false
            for(let i of clientPlayers){
                bool = false
                for(let j of serverData){
                    if(i.name == j.name){
                        bool = true
                        break
                    }
                }
                if(!bool) output.push(i)
            }
            return output
        }
    }

    addPlayer(vel, name){
        //console.log(vel)
        const player = new Box({
            pos: [100, 100],
            vel: [0, 0],
            size: [50, 50],
            color: "blue",
            name: name,
            physics: true
        })
        this.players.push(player)
        //console.log(player)
        console.log(`Player ${name} added`)
    }

    delPlayer(name){
        let i = 0;
      for(let player of this.players){
        if(name == player.name){
            this.players.splice(i, 1);
            //console.log("spliced:", player.name)
        }
        i++;
    }
    }
    updateVelPlayers(data){
        if(this.players.length == data.length){
            for(let clientPlayer of this.players){
                for(let serverData of data){
                    if(clientPlayer.name == serverData.name){

                        clientPlayer.vel = serverData.vel
                        clientPlayer.pos = serverData.pos
                        break
                    }
                }
            }
        }
        if(this.players.length < data.length){
            this.searchAdded(data, this.players).forEach(e => {
                this.addPlayer(e.vel, e.name)
            })
        }else if(this.players.length > data.length){
            this.searchRemoved(data, this.players).forEach(e => {
                this.delPlayer(e.name)
            })
        }
    }
    

    updatePlayers(deltaTime){
        if(this.players.length == 0){
            //console.log("no players")
            return
        } 
        //console.log(this.players)
        for(let player of this.players){
            //console.log("update:", player.name)
            player.update(deltaTime)
            player.draw()
            player.inLevelBounds()
        }
    }
}