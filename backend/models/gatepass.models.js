const mongoose = require('mongoose');

const gatepassSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
    },
    leaveType : {
        type : String,
        required : true,
        enum : ["Day Out","Night Out"],
        default : "Day Out",
    },
    outDate : {
        type : Date,
        required : true,
    },
    outTime : {
        type : String,
        required : true,
    },
    inDate : {
        type : Date,
    },
    inTime : {
        type : String,
        required : true,
    },
    reason : {
        type : String,
        require : true,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
    },
    approvedOrRejectedBy : {
        type : String,
    },
    status : {
        type : String,
        enum : ["Pending","Rejected","Approved"],
        default : "Pending",
    },
    hostel : {
        type : String,
        required : true,
    },
},{timestamps : true});

const Gatepass = mongoose.model("gatepass",gatepassSchema);

module.exports = Gatepass;