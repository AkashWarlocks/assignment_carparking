require('../database/databaseconn')
const AllotParking = require('../model/allotparking')
const Level = require('../model/level')
const Row = require('../model/row')
let levelHandler = {}
//Function to Add a Level
levelHandler.addLevel = async (req,res)=>{
    
    try {
        const addLevel =  new Level(req.body)    
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

//Function to Add a Row
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
//Allot parking Slot function
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

        //Checks if Vehicle is already present
        let checkVehicleAvailable = await Row.aggregate([
            {$unwind:"$slots"},
            {$match:{"slots.vehicleNo":req.body.vehicleNo}}
        ])
        
        if(req.body.carType=="Motorcycle" && checkVehicleAvailable.length == 0){
            //Allocation for vehicle type motorcycle
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
                    "slots.$.occupied":true,
                    "slots.$.startSlot":avail.slotId,
                    "slots.$.vehicletype":req.body.carType,
                    "slots.$.vehicleNo":req.body.vehicleNo
                }
            })
            console.log("update ",update)

        } else if(req.body.carType=="Bus" && checkVehicleAvailable.length == 0){
            //Allocation for vehicle Bus
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
        //LOGIC FOR 5 Large Spots in linear fashion
        for(var i=0 ;i<data.length;i++){
            
            if(data[i+1] && data[i+2] && data[i+3] && data[i+4] && (data[i].levelNo == data[i+4].levelNo)&& ( data[i].rowNo == data[i+4].rowNo)){
                console.log("inside If")
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
                    slotNo:data[i].slots.slotNo+" "+data[i+1].slots.slotNo+" "+data[i+2].slots.slotNo+" "+data[i+3].slots.slotNo+" "+data[i+4].slots.slotNo,
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
                    "slots.$[elem].startSlot":avail.slotId_1,
                    "slots.$[elem].vehicleNo":req.body.vehicleNo,
                    "slots.$[elem].vehicletype":req.body.carType
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
    } else if(req.body.carType=="Car" && checkVehicleAvailable.length == 0){
            ////Allocation for vehicle type motorcycle
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
            //console.log(data)
        //console.log(data) 
    
            avail = {
                status:"Parking Available",
                levelNo:data[0].levelNo,
                rowId:data[0]._id,
                slotId:data[0].slots._id,
                rowNo :data[0].rowNo,
                slotNo:data[0].slots.slotNo
            }

            //console.log(avail)
            let update = await Row.updateOne({
                "_id":avail.rowId,
                "slots._id":avail.slotId
            },{
                $set:{
                    "slots.$.occupied":true,
                    "slots.$.startSlot":avail.slotId,
                    "slots.$.vehicletype":req.body.carType,
                    "slots.$.vehicleNo":req.body.vehicleNo
                }
            })
            console.log("update ",update)

}   if(checkVehicleAvailable.length != 0) {
    console.log("in if")
    avail.status = "Vehicle is already present"
 }

    res.status(200).send(avail)
 
    } catch (error) {
        console.log(error)
        res.status(400).send({
            error
        })
    }
}

//Function to get Single vehicle info
levelHandler.getVehicleInfo = async(req,res)=>{
    let vehicleStatus = {
        status:"Not Available",
        data:""
    }
    try {
        console.log(req.body)
    let data = await Row.aggregate([
            {$unwind:"$slots"},
            {$match:{"slots.vehicleNo":req.body.vehicleNo}        
    }])
    if(data.length!=0){
        vehicleStatus={
            status:"Vehicle Available",
            data:data
        }
    }

    res.status(200).send(vehicleStatus) 
    } catch (error) {
        
    }
}
// Function to get Parked vehicle Data
levelHandler.getParkeddata = async(req,res)=> {
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
        //console.log(slotType)
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
        res.status(400).send(error)
    }
}
//Used to call API from postman to deallocate all spots
levelHandler.deAllocateAll = async(req,res)=>{
    try {
        console.log("dela ",req.body)
        let data = await Row.updateMany({
            "slots.occupied": true
        },{
            $set:{
                "slots.$[elem].occupied":false,
                "slot.$[elem].startSlot":'',
                "slot.$[elem].vehicletype":'',
                "slot.$[elem].vehicleNo":'',
            }
        },{ arrayFilters:[{
            "elem.occupied":true
        }],
            multi:true
        }
    )
    res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
//Function to deallocate single spot
levelHandler.deAllocateSpot = async (req,res)=>{
    
    
    try {
       // console.log("dela ",req.body)
        let data = await Row.updateMany({
            "slots.startSlot": req.body.slots.startSlot
        },{
            $set:{
                "slots.$[elem].occupied":false,
                "slot.$[elem].startSlot":"empty",
                "slot.$[elem].vehicletype":"empty",
                "slot.$[elem].vehicleNo":"empty",
            }
        },{ arrayFilters:[{
            "elem.startSlot":req.body.slots.startSlot
        }],
            multi:true
        }
    )
    res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
//Function to count no. of vehicles parked and their types
levelHandler.getCountVehicle = async(req,res)=>{
    let vehicleCount = {
        "Motorcycle":0,
        "Car":0,
        "Bus":0,
        "Total":0
    }
    try {
        motorcycle = await Row.aggregate([
            {$unwind:"$slots"},
            {$match:{
                "slots.occupied":true,
                "slots.vehicletype":"Motorcycle"
            }
            },
            {$sort:{
                levelNo:1,
                rowNo:1
            }}
        ])
        bus = await Row.aggregate([
            {$unwind:"$slots"},
            {$match:{
                "slots.occupied":true,
                "slots.vehicletype":"Bus"
            }
            },
            {$sort:{
                levelNo:1,
                rowNo:1
            }}
        ])
        car = await Row.aggregate([
            {$unwind:"$slots"},
            {$match:{
                "slots.occupied":true,
                "slots.vehicletype":"Car"
            }
            },
            {$sort:{
                levelNo:1,
                rowNo:1
            }}
        ])
        vehicleCount={
            "Motorcycle":motorcycle.length,
            "Bus":(bus.length/5),
            "Car":car.length,
            "Total":motorcycle.length +(bus.length/5) + car.length
        }
        res.status(200).send(vehicleCount)
    } catch (error) {
        
    }
}
module.exports = levelHandler