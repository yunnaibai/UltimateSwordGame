const express = require('express')
const router = express.Router()

router.get('/salt/', (req, res) => {
    console.log("searchin for the white crystals")
    if(req.body.name == "Michi"){
        res.status(300).send("Here is your Salt: 🧂")
    }else{
        res.status(418).send("No Salt for you Sir" + req.body)
    }
})
module.exports = router