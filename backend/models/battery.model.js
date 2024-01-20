import mongoose from "mongoose";

const batterySchema = mongoose.Schema({
    stock_id : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        default : 0,
        required : true
    },
    added_date : {
        type : String,
        required : true
    },
    warranty : {
        type : String,
        required : true
    },
    sellingPrice : {
        type : Number,
        required : true,
    },
    actualPrice : {
        type : Number,
        required : true
    },
    batteryBrand : {
        type : String,
        required : true
    },
    batteryDescription :{
        type : String,
        required : true
    },
    status : {
        type : String,
        default : "REQUESTED"
    },
    isDeleted : {
        count : {
            type : Number,
            default : 0
        },
        description : {
            type : String,
            default : ''
        }
    }
});

const Battery = mongoose.model("batteries",batterySchema);

export default Battery;
