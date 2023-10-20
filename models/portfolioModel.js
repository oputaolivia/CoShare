// include the number of units a user bought

// so each time a user makes an investment, we will have a box of details about that investment

const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
    userId:{
        type: String,
    },
    groupName:{
        type: String,
    },
    amount:{
        type: Number,
    },
    units:{
        type: Number,
    },
}, {timestamps});

const Portfolio = mongoose.model("portfolio", portfolioSchema);
module.exports = Portfolio;