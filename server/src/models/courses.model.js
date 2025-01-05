import mongoose from 'mongoose';

const coursesModel = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        minlength: 10,
      },
      picture: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
      },
      deleted: {
        type: Boolean,
        default: false,
      },
  },
  { timestamps: true }
);

const Courses = mongoose.model('Courses',coursesModel)

export default Courses