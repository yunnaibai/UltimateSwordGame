import {ctx} from "../canvas.js"


export class Rectangle 
{
    constructor(options) 
    {
        this.pos = options.pos
        this.size = options.size
        this.color = options.color
        this.type = "Rectangle"
    }

    get left()
    {
        return this.pos[0]                      // pos[0] gibt mir die Position des Objekts auf der Y-Achse wieder
    }

    get right()
    {
        return this.pos[0] + this.size[0]       // pos[0] gibt mir die Position auf der X-Achse und size[0] gibt mir die breite des Objekts wieder
    }

    get top()
    {
        return this.pos[1]                      // pos[1] gibt mir die Position des Objekts auf der Y-Achse wieder
    }
    
    get bottom()
    {
        return this.pos[1] + this.size[1]       // pos[1] gibt mir die Position auf der Y-Achse und size[1] gibt mir die Höhe bzw. größe des Objekts wieder
    }

    setLeft(val)
    {
        this.pos[0] = val
    }

    setRight(val)
    {
        this.pos[0] = val - this.size[0]
    }

    setTop(val)
    {
        this.pos[1] = val
    }

    setBottom(val)
    {
        this.pos[1] = val - this.size[1]
    }
    
    draw()
    {
        ctx.fillStyle = this.color
        ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
    }

    collision(b)
    {
        if(this.right >= b.left) 
        {
            if(this.bottom >= b.top)
            {
                if(this.left <= b.right)
                {
                    if(this.top <= b.bottom)
                    {
                        return true
                    }
                }
            }
        }
        return false
    }
}