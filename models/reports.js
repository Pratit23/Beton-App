const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const reportsSchema = new mongoose.Schema({
    location:{
        type:String,
        require:true
    },
    userID:{
        type:String,
        require:true,
        ref:'User'
    },
    image :{
        type:String,
        require:true,
    },
    address:{
        type: String,
        require: true
    },
    reportedAt: {
        type: String,
        require: true
    },
    reportedOn: {
        type: String,
        require: true
    },
    baseParent: {
        type: ObjectId,
        require: true,
        ref: "BaseReports"
    }
});

module.exports = mongoose.model("Reports", reportsSchema);