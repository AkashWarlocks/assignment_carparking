const mongoose = require('mongoose')

const allotParkingSchema = new mongoose.Schema({   
    levelNo:{
            type:String,
            required:true,
        },
    row:[{
            rowNo:{
                type:String,
                required:true,
            },
            slots:[
                {
                    slotNo:{
                        type:Number,
                        required:true,
                    },
                    slotType:{
                        type:String,
                        enum:['Motorcycle','Compact','Large']
                        
                    },
                    occupied:{
                        type:Boolean,
                        required:true,
                    },
                    currentVehicle:{
                        type:String,
                    }               
                }],

        }],
        totalrows:{
            type:Number,
            required:true
        },
        levelIsFull:{
            type:Boolean,
            default:false,
        }
 
})

const AllotParking = mongoose.model('AllotParking', allotParkingSchema)

module.exports = AllotParking