
app.post('/fund-and-invest/:userId/:groupId', async (req, res) => {
    const { userId, groupId } = req.params;
    const { amount, payeeMomoNumber } = req.body;
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Perform the wallet funding using MTN MoMo API
    const fundWalletResult = await fundWallet(user, amount, payeeMomoNumber);
  
    if (fundWalletResult.error) {
      return res.status(500).json({ message: 'Funding wallet failed' });
    }
  
    // Now, proceed to invest in the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
  
    // Create an investment record
    const investment = {
      user: user._id,
      amount: amount,
    };
  
    group.investments.push(investment);
    await group.save();
  
    // Update the user's wallet balance
    user.walletBalance += amount;
    await user.save();
  
    res.json({ message: 'Wallet funded and investment made successfully' });
  });
  