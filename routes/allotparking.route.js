const express = require('express')
const levelhandler = require('../handlers/level.handler')

router = express()
router.post('/addLevel',(req,res)=>{
    levelhandler.addLevel(req,res)
})

router.post('/allotparking', async (req,res)=>{
   await levelhandler.allotParking(req,res)
    
})

module.exports = router