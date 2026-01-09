const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
    },
    complaintType : {
        type : String,
        required : true,
        enum : ["Furniture","Electrical","Water Supply","Cleaning","Mess Food"],
    },
    complaintDetails : {
        type : String,
        required: true
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
        enum : ["Pending","Resolved","Dismissed"],
        default : "Pending",
    },
    hostel : {
        type : String,
        required : true,
    },
},{timestamps : true});

const Complaints = mongoose.model("complaints",complaintSchema);

module.exports = Complaints;