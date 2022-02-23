export class Players 
{
    constructor(options){
        this.players = []
    }
    autoUpdate(socket){
        socket.on("players", (data) => {
            //console.clear()
            //console.log(data)
            const lookForPlayer = () => {
                for(const player of data.players){
                    //console.log(player.name)
                    if(this.players.length == 0) this.addPlayer(player.pos, player.name)
                    for(const localPlayer of this.players){
                        if(player.name == localPlayer.name && player.name != localStorage.getItem("username")){
                            console.log("update pos")
                            localPlayer.pos[player.pos[0], player.pos[1]]
                            localPlayer.name = player.name
                            break
                        }
                        this.addPlayer(data.pos, data.name)
                    }
                }
            }
            lookForPlayer()
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
        console.log("new Player added")
    }

    updateDrawPlayers(){
        for(player of this.players){
            player.update(deltaTime)
            player.inLevelBounds()
        }
    }
}