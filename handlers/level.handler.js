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

        console.log(levelData.row.length)
            
        if(levelData.isLevelFull == true){
            res.status(200).send({
                "status":"Parking is Full"
            })
        }
        let avail={}
        avail = await AllotParking.findOne({
            isLevelFull:false,
            row:{$all:[{
                $elemMatch:{
                    rowIsFull:false,
                    slots:{
                        $all:[
                            {
                                $elemMatch:{
                                    slotType:"Motorcycle",
                                    occupied:false
                                }
                            }
                        ]
                    }
                }
            }]  
        } 
        })
        console.log("mongo ",avail)
        let check = "false"
        // if(req.carType == "Motorcycle"){

        // }else if(req.carType == "Car"){

        // }else if(req.carType == "Bus"){

        // }
        for(var i =0;i<levelData.row.length;i++){
            if(check == "true"){
                //console.log('in break')
                break
            }
            for(var j = 0; j<levelData.row[i].slots.length;j++){
                //console.log("ruun",i,j)
                //console.log("Slot ",levelData.row[i].slots[j].slotType)
                if(levelData.row[i].slots[j].slotType == "Motorcycle" && !levelData.row[i].slots[j].occupied){
                    avail = {
                        rowNo:levelData.row[i].rowNo,
                        slotNo:levelData.row[i].slots[j].slotNo
                    }
                   check = "true" 
                   break
                   
                }
                
            }
        }    
            
        
        console.log(avail)
        res.status(200).send({
            Status:"Available",
            Level:levelData.levelNo,
            avail    
        })
        
        /*levelData.row.some((row,i) => {
            row.slots.some((slot,j)=>{
                console.log(slot.slotType+" AND ",slot.occupied)
                if(slot.slotType == "Motorcycle" && !slot.occupied){
                    avail = {
                        rowNo:i+1,
                        slotNo:j+1
                    }
                    
                }
            })
        });*/
 
    } catch (error) {
        console.log(error)
        res.status(400).send({
            error
        })
    }
}

module.exports = levelHandler