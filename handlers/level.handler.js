require('../database/databaseconn')
const AllotParking = require('../model/allotparking')

let levelHandler = {}

levelHandler.addLevel = async (req,res)=>{
    try {
        const addLevel =  new AllotParking(req.body)    
        await addLevel.save()
        res.status(200).send({
            status:"Level added",
            data:addLevel
        })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
    
}
levelHandler.allotParking = async(req,res)=>{
    try {
        
        levelData = await AllotParking.findOne()
        console.log(levelData)

        console.log(levelData.row)
            
        if(levelData.isLevelFull == true){
            res.status(200).send({
                "status":"Parking is Full"
            })
        }
        let avail={}
        levelData.row.some((row,i) => {
            row.slots.some((slot,j)=>{
                console.log(slot.slotType+" AND ",slot.occupied)
                if(slot.slotType == "Motorcycle" && !slot.occupied){
                    avail = {
                        rowNo:i+1,
                        slotNo:j+1
                    }
                    
                }
            })
        });
        console.log(avail)
        
    

    res.status(200).send({
        avail
    })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            error
        })
    }
}

module.exports = levelHandler