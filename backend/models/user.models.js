const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/auth.services.js");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/user-avatar.png",
    },
    role: {
      type: String,
      required: true,
      enum: ["Student", "Warden", "Admin"],
      default: "Student",
    },
    hostel: {
      type: String,
      required: true,
    },
    room: {
      type: String,
    },
    rollNo: {
      type: String,
    },
    pass: {
      type: String,
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("pass")) {
    return;
  }

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.pass)
    .digest("hex");

  this.salt = salt;
  this.pass = hashedPassword;

  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("User Not Found");
  }

  const salt = user.salt;
  const hashedPassword = user.pass;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash) {
    throw new Error("Invalid Password");
  }
  const token = createToken(user);
  return token;
});

const User = mongoose.model("user", userSchema);

module.exports = User;
