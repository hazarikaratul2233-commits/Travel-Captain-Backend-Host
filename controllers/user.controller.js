import bcrypt from "bcrypt";

import User from "../models/user.model.js";
  
// ----------------------
// Helpers
// ----------------------
const toDateOrThrow = (value, fieldName) => {

  if (value === undefined || value === null || value === "") return undefined;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    const err = new Error(`Invalid ${fieldName} format`);
    err.statusCode = 400;
    throw err;
  }
  return d;
};

const cleanObject = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

const toSafeUser = (user) => {  

  const obj = user?.toJSON ? user.toJSON() : user;
  if (!obj) return obj;
  // remove sensitive fields
  const { password, ...safe } = obj;
  return safe;
};

const toSafeUsers = (users = []) => users.map(toSafeUser);

export const createUser = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await User.scan("email").eq(email).exec();

    if (existing.count > 0) {
      return res.status(400).json({
        status: false,
        message: `Employee with email '${email}' already exists in database`
      });
    }

    // default password
    const plainPass = "aaaaaa";
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(plainPass, salt);


    const finalUser = cleanObject({
      ...req.body,
      password: hashedPass,
      doj: new Date(req.body.doj),
      online: false
    });

    const user = await User.create(finalUser);

    return res.status(200).json({
      status: true,
      data: toSafeUser(user)
    });
  } catch (err) {
    return res.status(err.statusCode || 400).json({
      status: false,
      message: err.message
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.scan().exec();

    return res.status(200).json({
      status: true,
      count: users.count,
      data: toSafeUsers(users)
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.get(req.params.id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      data: toSafeUser(user)
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

export const setOnlineStatusById = async (req,res) => {
  try {
    const _id = req.params.id;
    const { online } = req.body;

    if(online===null) return res.status(404).json({ status: false, message: "Provide the online status" });

    const current = await User.get({_id});
    if(!current) return res.status(404).json({ status: false, message: "User not found" });

    const payload = cleanObject({online});

    const updated = await User.update({ _id }, payload, { return: "item" });

    return res.status(200).json({
      status: true,
      data: toSafeUser(updated),
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
}

// CHANGE PASSWORD section // 

export const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    
    const user = await User.get(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be same as current password",
      });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    await User.update(
      { _id: userId }, 
      { password: hashedPassword }
    );

    return res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};



// ----------------------
// UPDATE USER
// ----------------------
// export const updateUser = async (req, res) => {
//   try {
//     const _id = req.params.id; // this is your UUID string

//     // check existing
//     const current = await User.get({ _id });
//     if (!current) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     // 🚫 block these from being updated here
//     if (req.body._id && req.body._id !== _id) {
//       return res.status(400).json({ status: false, message: "user cannot be updated" });
//     }
//     if (req.body.password !== undefined) {
//       return res.status(400).json({ status: false, message: "password cannot be updated here" });
//     }

//     const dob = toDateOrThrow(req.body.dob, "dob");
//     const doj = toDateOrThrow(req.body.doj, "doj");

//     const payload = cleanObject({
//       ...req.body,
//       dob,
//       doj,
//     });

//     // ✅ Dynamoose update must use the real key
//     const updated = await User.update({ _id }, payload, { return: "item" });

//     return res.json({
//       status: true,
//       data: toSafeUser(updated),
//     });
//   } catch (err) {
//     return res.status(400).json({
//       status: false,
//       message: err.message,
//     });
//   }
// };


// ----------------------
// UPDATE THOUGHTS
// ----------------------
// export const updateThoughts = async (req, res) => {
//   try {
//     const { myThoughts } = req.body;
//     const _id = req.params.id;

//     if (!myThoughts) {
//       return res.status(400).json({ status: false, message: "Thoughts is required" });
//     }

//     const user = await User.get(_id);
//     if (!user) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     await User.update({ _id }, { myThoughts });

//     return res.json({ status: true, message: "Thoughts updated successfully!" });
//   } catch (err) {
//     return res.status(500).json({ status: false, message: err.message });
//   }
// };

// ----------------------
// DELETE USER
// ----------------------
// export const deleteUser = async (req, res) => {
//   try {
//     const staffID = req.params.id;

//     const user = await User.get(staffID);
//     if (!user) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     await User.delete(staffID);

//     return res.json({
//       status: true,
//       data: toSafeUser(user)
//     });
//   } catch (err) {
//     return res.status(500).json({ status: false, message: err.message });
//   }
// };


// ----------------------
// CHANGE PASSWORD (SELF)
// ----------------------
// export const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const _id = req.params.id;
    
//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         status: false,
//         message: "Both currentPassword and newPassword are required"
//       });
//     }
    
//     const user = await User.get(_id);
//     if (!user) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ status: false, message: "Current password is incorrect" });
//     }

//     const sameAsOld = await bcrypt.compare(newPassword, user.password);
//     if (sameAsOld) {
//       return res.status(400).json({ status: false, message: "New password cannot be same as old password" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(newPassword, salt);

//     await User.update({ _id }, { password: hashed });

//     return res.json({ status: true, message: "Password updated successfully" });
//   } catch (err) {
//     return res.status(500).json({ status: false, message: err.message });
//   }
// };

// ----------------------
// CHANGE PASSWORD (ADMIN)
// ----------------------
// export const changePasswordAdmin = async (req, res) => {
//   try {
//     const { newPassword } = req.body;
//     const _id = req.params.id;

//     if (!newPassword) {
//       return res.status(400).json({ status: false, message: "A new password is required" });
//     }

//     const user = await User.get(_id);
//     if (!user) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     const sameAsOld = await bcrypt.compare(newPassword, user.password);
//     if (sameAsOld) {
//       return res.status(400).json({ status: false, message: "New password cannot be same as old password" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(newPassword, salt);

//     await User.update({ _id }, { password: hashed });

//     return res.json({ status: true, message: "Password updated successfully" });
//   } catch (err) {
//     return res.status(500).json({ status: false, message: err.message });
//   }
// };
