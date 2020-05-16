const mongoose = require('mongoose')

const allotParkingSchema = new mongoose.Schema({   
    levelNo:{
            type:Number,
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
                        default:false,
                    },
                    currentVehicle:{
                        type:String,
                    }               
                }],
                rowIsFull:{
                    type:Boolean,
                    default:false
                }

        }],
        totalrows:{
            type:Number,
            
        },
        levelIsFull:{
            type:Boolean,
            default:false,
        }
 
})

const AllotParking = mongoose.model('AllotParking', allotParkingSchema)

module.exports = AllotParking