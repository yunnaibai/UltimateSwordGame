const express = require('express')
const router = express.Router()

router.get('/getSalt/', (req, res) => {
    console.log("searchin for the white crystals")
    if(req.body == "Michi"){
        res.status(300).send("🧂")
    }else{
        res.status(418).send("No Salt for you Sir </br> btw " + req.route)
        console.log(req.route)
    }
})
module.exports = router