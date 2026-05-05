import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const ADMIN_ROLE = "admin";

export const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || email === "") {
      return res.status(200).json({ status: false, issueWith: "email", message: "email missing" });
    }

    if (!password) {
      return res.status(200).json({ status: false, issueWith: "password", message: "password missing" });
    }

    const result = await User.scan("email").eq(email).exec();
    const user = result?.[0] || null;

    if (!user) {
      return res.status(400).json({ status: false, issueWith: "email", message: "email not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        status: false,
        message: "Password not available for this user record (check GSI projection or stored item)"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, issueWith: "password", message: "incorrect password" });
    }

    const { password: _, ...safeUser } = user.toJSON
      ? user.toJSON()
      : user;

    return res.status(200).json({
      status: true,
      data: safeUser
    });

  } catch (err) {
    return res.status(400).json({ status: false, message: err.message });
  }
};

// =====================
// ADMIN LOGIN
// =====================
export const authenticateAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || email === "") {
      return res.status(400).json({ status: false, issueWith: "email", message: "email missing" });
    }
    
    if (!password) {
      return res.status(400).json({ status: false, issueWith: "password", message: "password missing" });
    }
    
    const result = await User.scan("email").eq(email).exec();
    const adminUser = result?.[0] || null;

    if (!adminUser) {
      return res.status(400).json({
        status: false,
        issueWith: "email",
        message: "Invalid admin credentials or role access denied"
      });
    }

    // ✅ Role check
    if (![ADMIN_ROLE].includes(adminUser.role)) {
      return res.status(400).json({
        status: false,
        issueWith: "email",
        message: "Invalid admin credentials or role access denied"
      });
    }

    if (!adminUser.password) {
      return res.status(400).json({
        status: false,
        message: "Password not available for this admin record (check stored item)"
      });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, issueWith: "password", message: "Incorrect Password" });
    }

    return res.status(200).json({ status: true, data: adminUser });
  } catch (err) {
    return res.status(400).json({ status: false, message: err.message });
  }
};
