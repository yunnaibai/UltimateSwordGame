export class Players 
{
    constructor(options){
        this.players = []
    }
    autoUpdate(socket){
        socket.on("players", (data) => {
            const lookForPlayer = () => {
                for(player of data.players){
                    for(localPlayer of this.players){
                        if(player.name == localPlayer.name && player.name != localStorage.getItem("username")){
                            localPlayer.pos[player.pos[0], player.pos[1]]
                            localPlayer.name = player.name
                            break
                        }
                        addPlayer(data.pos, data.name)
                    }
                }
            }
        })
    }
    addPlayer(pos, name){
        if(player.name != localStorage.getItem("username")) return
        const player = new Box({
            pos: pos,
            size: [50, 50],
            color: "red",
            name: name
        })
        this.players.push(player)
    }

    updateDrawPlayers(){
        for(player of this.players){
            player.update(deltaTime)
            player.inLevelBounds()
        }
    }
}