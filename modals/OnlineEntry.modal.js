const mongoose = require('mongoose');
const schema = mongoose.Schema;

const EntrySchema = new schema({
    currentDate: String,
    amount: Number,
    gst: Number,
    subTotal: Number,
    bankAccount: String,
    paymentStatus: String,
    entryType: String,
    paymentMethod: String,
    busNo: String
},{
    timestamps : true,
})
const Onlineform = mongoose.model('Entries',EntrySchema);

module.exports = Onlineform;
