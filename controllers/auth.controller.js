const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
 const { token } = req.body;
 try {
   const ticket = await client.verifyIdToken({
     idToken: token,
     audience: process.env.GOOGLE_CLIENT_ID,
   });
   const payload = ticket.getPayload();
   const { sub: googleId, name,given_name,family_name, email, picture } = payload;
   let user = await User.findOne({ googleId });

   if (!user) {
     user = new User({ 
      firstname:given_name,
      lastname:family_name,
      googleId,
      name,
      email,
      picture
     });
     await user.save();
   }
   const userData= { 
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    picture: user.picture,
    name: name,
   }
   res.status(200).json({ user: userData, token, message: 'User connected successfully' });
 } catch (error) {
   console.error("Error verifying Google token:", error);
   res.status(400).json({ error: "Invalid token" });
 }
};



exports.register = async (req, res) => {
 const { firstname, lastname, email, password, name } = req.body;
 try {
  const user = await User.findOne({ email });
  if (user) {
   return res.status(400).json({ message: 'User already exists' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
   firstname,
   lastname,
   email,
   name,
   password: hashedPassword,
  });

  const userData= { 
    id: newUser._id,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    email: newUser.email,
    picture: newUser.picture,
    name: name,
    playlist: newUser.playlist,
   }
  const token = jwt.sign(userData, process.env.JWT_SECRET);
  return res.status(201).json({ token, user: userData});
 } catch (error) {
  return res.status(500).json({ message: 'Internal server error', error });
 }
};

exports.login = async (req, res) => {
 const { email, password } = req.body;
 
 try {
  const user = await User.findOne({ email });
  if (!user) {
   return res.status(400).json({ message: 'User not found' });
  }
  if (user.googleId) {
    return res.status(400).json({ message: 'This user is a google account user, try login with your google account' });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
   return res.status(400).json({ message: 'Incorrect password' });
  }
  const token = jwt.sign({ id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    picture: user.picture,
    playlist: user.playlist,
  }, process.env.JWT_SECRET);
  const userData= { 
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    picture: user.picture,
    name: user.name,
    playlist: user.playlist,
  }
  return res.status(200).json({ token, user: userData});
 } catch (error) {
  console.log(error);
  
  return res.status(500).json({ message: 'Internal server error' });
 }
};

exports.logout = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ message: "Could not log out, please try again." });
      }

      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Could not log out, please try again." });
          }
          return res.status(200).json({ message: "Logged out successfully" });
        });
      } else {
        return res.status(200).json({ message: "Logged out successfully" });
      }
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};