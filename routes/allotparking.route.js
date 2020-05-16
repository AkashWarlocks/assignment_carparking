const express = require('express')
const levelhandler = require('../handlers/level.handler')

router = express()
router.post('/addLevel',(req,res)=>{
    levelhandler.addLevel(req,res)
})

router.post('/allotparking', async (req,res)=>{    
        await levelhandler.allotParking(req,res)     
})

router.post('/addRow' , async(req,res)=>{
    console.log(req.body)
    await levelhandler.addRow(req,res)
})

router.post('/getParkedData', async(req,res)=>{
    await levelhandler.getParkeddata(req,res)
})

router.post('/deAllocateSpot',async (req,res)=>{
    await levelhandler.deAllocateSpot(req,res)
})
module.exports = router