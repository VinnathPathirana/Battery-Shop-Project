import mongoose from "mongoose";


const invoiceSchema = new mongoose.Schema({
    cusName : {
        type : String,
        required : true,
    },
    invoice_id : {
        type : String,
        required : true,
    },
    cusAddress : {
        type : String,
        default : 'not mentioned'
    },
    cusPhone : {
        type : String,
        required : true,
    },
    cusEmail : {
        type : String,
    },
    issuedDate : {
        type : Date,
        required : true,
    },
    items : [
        {
            _id : {
                type : mongoose.Schema.Types.ObjectId,
                required : true,
            },
            price : {
                type : Number,
                required : true,
            },
            brand : {
                type : String,
                required : true,
            },
            price : {
                type : Number,
                required : true,
            },
            quantity : {
                type : Number,
                required : true,
            },
            totalPrice : {
                type : Number,
                required : true,
            },
            warranty :{
                type : String,
                required : true,
            }
        }
    ],
    totalActualPrice : {
        type : Number,
        required : true,
    },
    totalSoldPrice : {
        type : Number,
        required : true,
    },
    discount : {
        type : Number,
        default:0
    }
},{timestamps:true});

const Invoice = mongoose.model("invoices",invoiceSchema);

export default Invoice;