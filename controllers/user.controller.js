const User = require('../models/user');

exports.editProfile = async (req, res) => {
 try {
  const { firstname, lastname, email } = req.body;
  const userId = req.params.id; 
  const updateData = {
    firstname,
    lastname,
    email,
  };
  if (req.file) {
    updateData.picture = process.env.HOST_URL + req.file.path;
  }
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(updatedUser);
 } catch (error) {
   console.error("Error updating user:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}

exports.getUser = async (req, res) => {
 try {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
 } catch (error) {
  console.error("Error getting user:", error);
  res.status(500).json({ message: "Internal server error" });
 }
}