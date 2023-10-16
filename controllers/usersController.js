const Business = require("../models/businessModel");
const User = require("../models/userModel");

const getInvestors = async (req, res) => {
  try {
    const investors = await User.find({});

    res.status(200).send({
      data: investors,
      message: `All Investors`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      message: err.message,
      status: 1,
    });
  }
};

const getBusinesses = async (req, res) => {
  try {
    const business = await Business.find({});

    res.status(200).send({
      data: business,
      message: `All businesses`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      message: err.message,
      status: 1,
    });
  }
};

const getInvestor = async (req, res) => {
  try {
    const { id } = req.params;

    const investor = await User.findById(id);

    res.status(200).send({
      data: investor,
      message: `${investor.firstName} details found`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      message: err.message,
      status: 1,
    });
  }
};

const getBusiness = async (req, res) => {
  try {
    const [id] = req.params;

    const business = await Business.findById(id);

    res.status(200).send({
      data: business,
      message: `${business.businessName} details found`,
      status: 0,
    });
  } catch (err) {
    res.staus(500).send({
      data: {},
      message: err.message,
      status: 1,
    });
  }
};

const updateInvestor = async(req,res) =>{
    try {
        const {id} = req.params;
        const userId = req.user;

        if (id !== userId)
            return res.status(401).send({
                data: {},
                message: `User not found`,
                staus: 1,
            });

        const user = await User.findOne({
            _id: id
        });
        const updatedUser = await User.findByIdAndUpdate(id, req.body );

        res.status(201).send({
            data: updatedUser,
            message:`${user.firstName}'s details has been updated`,
            status: 0,
        })
    } catch (err) {
       res.status(500).status({
        data: {},
        message: err.message,
        status: 1,
       }) 
    }
};

const updateBusiness = async(req,res) =>{
    try {
        const {id} = req.params;
        const userId = req.user;

        if (id !== userId)
            return res.status(401).send({
                data: {},
                message: `User not found`,
                staus: 1,
            });

        const user = await Business.findOne({
            _id: id
        });
        const updatedBusiness = await Business.findByIdAndUpdate(id, req.body );

        res.status(201).send({
            data: updatedBusiness,
            message:`${user.businessName}'s details has been updated`,
            status: 0,
        })
    } catch (err) {
       res.status(500).status({
        data: {},
        message: err.message,
        status: 1,
       }) 
    }
};

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user;

        if (id !== userId)
            return res.status(401).send({
                data: {},
                message: `Unauthorized`,
                status:1,
            })
        const user = await User.findOne({_id:id}) || await Business.findOne({_id:id});

        if (!user)
            return res.status(401).send({
                data: {},
                message: `User does not exist!`,
                status: 1,
            });

        const deletedUser = await User.findByIdAndRemove(id) || await Business.findByIdAndRemove(id);
        res.staus(201).send({
            message: `User Deleted`,
            status:9,
        })
    } catch (err) {
        res.status(500).send({
            data:{},
            message: err.message,
            status: 1,
        })
    }
};

module.exports = {
  getInvestors,
  getBusinesses,
  getInvestor,
  getBusiness,
  updateBusiness,
  updateInvestor,
  deleteUser,
};
