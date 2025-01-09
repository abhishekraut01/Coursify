import mongoose from 'mongoose';

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    purchasedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userModel);

export default User;
