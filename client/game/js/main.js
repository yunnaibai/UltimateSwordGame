import {Rectangle} from "./objects/Rectangle.js"
import {Box} from "./objects/Box.js"
import {clearCanvas} from "./canvas.js"
import {timer} from "./Timer.js"

const rechteck1 = new Rectangle({pos: [10, 30], size: [300, 20], color: "black"})
const rechteck2 = new Rectangle({pos: [10, 40], size: [300, 20], color: "red"})
const rechteck3 = new Rectangle({pos: [10, 70], size: [300, 20], color: "gold"})


rechteck1.draw()
rechteck2.draw()
rechteck3.draw()



const box = new Box
({
    pos: [100, 500],
    size: [100, 100],
    color: "red",
})

box.vel = [0.1, -0.2]

box.update(1000 / 60)

box.draw()

timer.update = (deltaTime) => 
{
    clearCanvas()
    box.update(deltaTime)
    box.inLevelBorder()
    box.draw()
    rechteck1.draw()
    rechteck2.draw()
    rechteck3.draw()
}

timer.start()

/* window.addEventListener("keydown", e => 
{
    if(e.key === " ")
    {
        clearCanvas()
        box.update(1000/60)
        box.draw()
        rechteck1.draw()
        rechteck2.draw()
        rechteck3.draw()
        
    }
}) */
