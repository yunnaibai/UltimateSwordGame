import {Rectangle} from "./Rectangle.js"
import {levelSize} from "../Level.js"

export class Box extends Rectangle 
{
    constructor(options)
    {
        super(options)
        this.grav = 0.00009      // Gravitation
        this.friction = 0.0       // Widerstand
        this.vel = [0,0]        // Geschwindigkeit
        this.acc = 0            // Beschleunigung
        this.onGround = false   // Gibt an, ob das Objekt auf dem Boden ist
    }

    update(deltaTime)
    {
        this.vel[0] += this.acc * deltaTime
        this.vel[0] *= (1 - this.friction)
        this.vel[1] += this.grav * deltaTime
        this.pos[0] += this.vel[0] * deltaTime
        this.pos[1] += this.vel[1] * deltaTime
        this.onGround = false
    }

    inLevelBorder()
    {
        if(this.left <= 0) this.vel[0] = 0.0
        if(this.right >= levelSize[0]) this.vel[0] = 0.0
        if(this.top <= 0) this.vel[1] = 0.0
        if(this.bottom >= levelSize[1])
        {
            this.vel[1] = 0.0
            this.grav = 0.0
            this.onGround = true
        }

    }
}