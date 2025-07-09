// import User from "../models/user.modle.js"
// import bcrypt from "bcryptjs"
// import { generateToken } from "../lib/utils.js"
// import cloudinary from "../lib/cloudinary.js"

// export const signup = async (req, res) => {
//     const { fullName, email, password } = req.body;
//     try {
//         if (!fullName || !password || !email) {
//             return res.status(400).json({ messsage: "All fields rare required" })
//         }
//         //hash password
//         if (!password || password.length < 6) {
//             return res.status(400).json({ message: "Password must be at least 6 characters" });
//         }
//         const user = await User.findOne({ email })
//         if (user) return res.status(400).json({ messsage: "Email already exists" })
//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(password, salt)

//         const newUser = new User({
//             fullName,
//             email,
//             password: hashedPassword
//         })
//         if (newUser) {
//             //generate jwttoken
//             generateToken(newUser._id, res)
//             await newUser.save()

//             // generate token
//             const token = generateToken(newUser._id);

//             // set cookie
//             res.cookie("token", token, {
//                 httpOnly: true,
//                 sameSite: "Lax",
//                 secure: process.env.NODE_ENV === "production",
//                 maxAge: 7 * 24 * 60 * 60 * 1000,
//             });

//             res.status(200).json({
//                 _id: newUser._id,
//                 fullName: newUser.fullName,
//                 email: newUser.email,
//                 profilePic: newUser.profilePic,
//             });
//         }
//         else {
//             res.status(400).json({ messsage: "Invalid user data" })
//         }
//     } catch (error) {
//         console.log("error in signUp controller ", error.messsage)
//         res.status(500).json({ messsage: "Internal server error" })
//     }
// }
// export const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const token = generateToken(user._id); // generate token

//         // ✅ Set the cookie before sending response
//         res.cookie("token", token, {
//             httpOnly: true,
//             sameSite: "Lax",
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//         });

//         // ✅ Send user response once
//         const safeUser = {
//             _id: user._id,
//             fullName: user.fullName,
//             email: user.email,
//             profilePic: user.profilePic,
//         };

//         res.status(200).json(safeUser);
//     } catch (error) {
//         console.error("Error in Login controller:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };



// export const logout = (req, res) => {
//     try {
//         res.cookie("jwt", "", { maxAge: 0 })
//         res.status(200).json({ message: "Logout successfully" })
//     } catch (error) {
//         console.log("error in Logout controller ", error.messsage)
//         res.status(500).json({ messsage: "Internal server error" })
//     }
// }

// export const updateProfile = async (req, res) => {
//     try {
//         const { profilePic } = req.body
//         const userId = req.user._id
//         if (!profilePic) {
//             return res.status(400).json({ message: "profile pic is required" })
//         }
//         const uploadResponse = await cloudinary.uploader.upload(profilePic)
//         const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
//         res.status(200).json(updatedUser)


//     } catch (error) {
//         console.log("error in update profile", error)
//         return res.status(500).json({ message: "Internal server error" })
//     }

// }

// export const checkAuth = (req, res) => {
//     try {
//         res.status(200).json(req.user)
//     } catch (error) {
//         console.log("error in checkAUth controller", error.message)
//         return res.status(500).json({ message: "Internal server error" })

//     }
// }




import { generateToken } from "../lib/utils.js";
import User from "../models/user.modle.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};