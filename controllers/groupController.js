const Business = require("../models/businessModel");
const Group = require("../models/groupModel");
const User = require("../models/userModel");

const createGroup = async (req, res) => {
  try {
    const { groupName, groupDescription, amountPerUnit, maxUnits, interest, period } = req.body;
    const userId = req.user;

    const business = await Business.findById(userId);
    const addGroup = business.numGroup + 1;
    if (!groupName || !groupDescription)
      return res.status(400).send({
        data: {},
        message: `Not all fiels have been entered`,
        status: 1,
      });

    const { groupImage } = req.files;
    const imageUrl = groupImage[0].path;

    const group = new Group({
      ownerId: req.user,
      groupName,
      groupDescription,
      groupImage: imageUrl,
      amountPerUnit,
      maxUnits,
      interest,
      period, // in months
      walletNumber: business.walletNumber,
    });
    const createdGroup = await group.save();
    const updateMember = await Group.findByIdAndUpdate(
      group._id,
      {
        $push: {
          members: req.user,
        },
      },
      {
        new: true,
      }
    );
    const updateNumGroup = await Business.findByIdAndUpdate(
      userId,
      {
        numGroup: addGroup,
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      data: createdGroup,
      message: `Group created by ${req.user} with members 
            ${updateMember.members}. ${req.user} has created ${updateNumGroup.numGroup} groups`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({});

    res.status(200).send({
      data: groups,
      message: `All groups`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

const getGroup = async (req, res) => {
  const { id } = req.params;
  const group = await Group.findById(id);

  if (!group)
    return res.status(401).send({
      data: {},
      message: `Group doesn't exist`,
      status: 1,
    });

  res.status(200).send({
    data: group,
    message: `${group.groupName} group details`,
    status: 0,
  });
};

const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const group = await Group.findOne({
      _id: id,
    });

    if (!group)
      return res.status(401).send({
        data: {},
        message: `Group doesn't exist`,
        status: 1,
      });

    if (user !== group.ownerId.valueOf())
      return res.status(401).send({
        data: {},
        message: `Unauthorized access`,
        status: 1,
      });

    const updatedGroup = await Group.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(201).send({
      data: updatedGroup,
      message: `Group Updated`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

const joinGroup = async (req, res) => {
  try {
    // specify max. number of 30
    const { id } = req.params;
    const userId = req.user;

    const user = await User.findById(userId);
    const group = await Group.findOne({
      _id: id,
    });

    if (!group)
      return res.status(401).send({
        data: {},
        message: `Group doesn't exist`,
        status: 1,
      });

    if (group.units == group.maxUnits)
      return res.status(400).send({
        data: {},
        message: `Can't Join, Investment Units exhausted`,
      });

    const newGroupNum = group.numMembers + 1;
    const addGroup = user.numGroup + 1;
    const updateMembers = await Group.findByIdAndUpdate(
      id,
      {
        numMembers: newGroupNum,
        $push: {
          members: user._id,
        },
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        numGroup: addGroup,
      },
      {
        new: true,
      }
    );

    return res.status(201).send({
      data: updateMembers,
      message: `${userId} Joined ${group.groupName} group.`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const user = await User.findById(userId);
    const group = await Group.findOne({
      _id: id,
    });

    if (!group)
      return res.status(401).send({
        data: {},
        message: `Group doesn't exist`,
        status: 1,
      });

    const newGroupNum = group.numMembers - 1;
    const minusGroup = user.numGroup - 1;
    const updateMembers = await Group.findByIdAndUpdate(
      id,
      {
        numMembers: newGroupNum,
        $pull: {
          members: user._id,
        },
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        numGroup: minusGroup,
      },
      {
        new: true,
      }
    );

    return res.status(201).send({
      data: updateMembers,
      message: `${userId} left ${group.groupName} group. This group has ${group.numMembers} members`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

const updateGroupImage = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const group = await Group.findOne({
      _id: id,
    });

    if (!group)
      return res.status(401).send({
        data: {},
        message: `Group doesn't exist`,
        status: 1,
      });

    if (user !== group.ownerId.valueOf())
      return res.status(401).send({
        data: {},
        message: `Unauthorized access`,
        status: 1,
      });

    const { groupImage } = req.files;
    const imageUrl = groupImage[0].path;

    const updatedGroupImage = await Group.findByIdAndUpdate(
      id,
      { groupImage: imageUrl },
      {
        new: true,
      }
    );

    return res.status(201).send({
      data: updatedGroupImage,
      message: `Group Image Updated`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

const deleteGroup = async (req, res) => {
  //subtract number of groups from user and delete id
  try {
    const { id } = req.params;
    const user = req.user;

    const group = await Group.findOne({
      _id: id,
    });

    if (!group)
      return res.status(401).send({
        data: {},
        message: `Group doesn't exist`,
        status: 1,
      });

    if (user !== group.ownerId.valueOf())
      return res.status(401).send({
        data: {},
        message: `Unauthorized access`,
        status: 1,
      });

    const members = group.members.valueOf();
    // subtract the num of groups from members
    for (const groupMember of members) {
      const member = await User.findById(groupMember.valueOf());

      if (member) {
        const minusGroup = member.numGroup - 1;
        await User.findByIdAndUpdate(
          groupMember.valueOf(),
          { numGroup: minusGroup },
          { new: true }
        );
      }
    }
    const deletedGroup = await Group.findByIdAndDelete(id);
    return res.status(201).send({
      data: {},
      message: `Group Deleted`,
      status: 0,
    });
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

module.exports = {
  createGroup,
  updateGroup,
  joinGroup,
  leaveGroup,
  deleteGroup,
  updateGroupImage,
  getGroup,
  getGroups,
};
