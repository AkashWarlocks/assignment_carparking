const mongoose = require('mongoose') 

const rowSchema = new mongoose.Schema({
    rowNo:{
        type:Number,
        required:true
    },
    levelNo:{
        type:Number,
        required:true,
    },
    slots:[{
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
        startSlot:{
            type:String
        }
    
    }]
})

const Row = mongoose.model('Row', rowSchema)

module.exports = Row 