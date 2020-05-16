require('../database/databaseconn')
const AllotParking = require('../model/allotparking')
const Level = require('../model/level')
const Row = require('../model/row')
let levelHandler = {}

levelHandler.addLevel = async (req,res)=>{
    
    try {
        const addLevel =  new evel(req.body)    
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

levelHandler.addRow = async (req,res)=>{
    try {
        console.log("start")
        const addRow =  new Row(req.body)    
        console.log("save")
        await addRow.save()
        
        res.status(200).send({
            status:"Row added",
            data:addRow    
        })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

}
levelHandler.allotParking = async(req,res)=>{
    try {
        console.log(req.body)
    let data ={}
    // = await AllotParking.aggregate([{
    //         $match:{levelIsFull:false,}},
    //         {$unwind:"$row"},
    //         {$match:{"row.rowIsFull":false,}},
    //         {$unwind:"$row.slots"},
    //         {$match:{"row.slots.occupied":true,"row.slots.slotType":"Large"}
    //     }])
        
        //console.log(data)
        let avail={
            status:"parking Not Available",
            rowNo:"Not available",
            slotNo:"Not available"
        }
        if(req.body.carType=="Motorcycle"){
                data = await Row.aggregate([
                    {$unwind:"$slots"},
                    {$match:{"slots.occupied":false}
            }])
            console.log(data) 
            if(data.length == 0){
                res.status(200).send(avail)
            }
            
            avail = {
                status:"Parking Available",
                levelNo:data[0].levelNo,
                rowId:data[0]._id,
                slotId:data[0].slots._id,
                rowNo :data[0].rowNo,
                slotNo:data[0].slots.slotNo
            }
            console.log(avail)
            let update = await Row.updateOne({
                "_id":avail.rowId,
                "slots._id":avail.slotId
            },{
                $set:{
                    "slots.$.occupied":true
                }
            })
            console.log("update ",update)

        } else if(req.body.carType=="Bus"){
            data = await Row.aggregate([
                {$unwind:"$slots"},
                {$match:{
                    "slots.occupied":false,
                    "slots.slotType":"Large"
                    }
                },
                {$sort:{
                    levelNo:1,
                    rowNo:1
                }}
            ])
        console.log(data)
        
        for(var i=0 ;i<data.length;i++){
            
            if(data[i+1] && data[i+2] && data[i+3] && data[i+4] && data[i].levelNo == data[i+1].levelNo && data[i].rowNo == data[i+1].rowNo){
                avail = {
                    status:"Parking Available",
                    levelNo:data[i].levelNo,
                    rowId_1:data[i]._id,
                    rowNo :data[i].rowNo,

                    slotId_1:data[i].slots._id,
                    slotId_2:data[i+1].slots._id,
                    slotId_3:data[i+2].slots._id,
                    slotId_4:data[i+3].slots._id,
                    slotId_5:data[i+4].slots._id,
                    
                    slotNo_1:data[i].slots.slotNo,
                    slotNo_2:data[i+1].slots.slotNo,
                    slotNo_3:data[i+2].slots.slotNo,
                    slotNo_4:data[i+3].slots.slotNo,
                    slotNo_5:data[i+4].slots.slotNo,
                }  
                break
            }
        }
        update = await Row.updateMany({
            _id:avail.rowId_1,
            
            },{
                $set:{
                    "slots.$[elem].occupied":true,
                    "slots.$[elem].startSlot":avail.slotId_1
                }
            },{
                arrayFilters:[{
                    "elem._id":{$in:[
                        avail.slotId_1,
                        avail.slotId_2,
                        avail.slotId_3,
                        avail.slotId_4,
                        avail.slotId_5,
                    ]}
                }]
            }
        )
        console.log("update ",update)
         
        console.log(avail)   
    } else if(req.body.carType=="Car"){
            //Allocate Parking for Car
            data = await Row.aggregate([
                {$unwind:"$slots"},
                {$match:{
                    "slots.occupied":false,
                    "slots.slotType":{
                        $in:["Compact","Large"]
                    }
                    }
                },
                {$sort:{
                    levelNo:1,
                    rowNo:1
                }}
            ])
            console.log(data)
        //console.log(data) 
    
            avail = {
                status:"Parking Available",
                levelNo:data[0].levelNo,
                rowId:data[0]._id,
                slotId:data[0].slots._id,
                rowNo :data[0].rowNo,
                slotNo:data[0].slots.slotNo
            }

            console.log(avail)
            let update = await Row.updateOne({
                "_id":avail.rowId,
                "slots._id":avail.slotId
            },{
                $set:{
                    "slots.$.occupied":true
                }
            })
            console.log("update ",update)

} 

    res.status(200).send(avail)
 
    } catch (error) {
        console.log(error)
        res.status(400).send({
            error
        })
    }
}

levelHandler.getParkeddata = async(req,res)=>{
    //console.log(req.body)
    slotType=[]
    try {
        if(req.body.carType == "Motorcycle"){
            slotType = ['Motorcycle']
        }else if(req.body.carType == "Car"){
            slotType = ["Compact","Large"]
        }else if(req.body.carType == "Bus"){
            slotType = ["Large"]
        } else if(req.body.carType == "ALL"){
            slotType = ["Motorcycle","Compact","Large"]
        }
        console.log(slotType)
        data = await Row.aggregate([
            {$unwind:"$slots"},
            {$match:{
                "slots.occupied":true,
                "slots.slotType":{
                    $in:slotType
                }
            }
            },
            {$sort:{
                levelNo:1,
                rowNo:1
            }}
        ])
       // console.log(data)

        res.status(200).send(data)
    } catch (error) {
        
    }
}

levelHandler.deAllocateSpot = async (req,res)=>{
    try {
        console.log("dela ",req.body)
        let data = await Row.updateMany({
            "slots.startSlot": req.body.startSlot
        },{
            $set:{
                "slots.$[elem]occupied":false
            }
        },{
            multi:true
        }
    )
    res.status(200).send(data)
    } catch (error) {
        
    }
}
module.exports = levelHandler