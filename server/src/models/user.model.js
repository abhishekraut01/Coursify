import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
import bcryptjs from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index:true
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
    refreshToken: {
      type: String, // Token used for managing authentication/refresh token 
    },
  },
  { timestamps: true }
);

//this enables the aggregation quries in user model
userSchema.plugin(mongooseAggregatePaginate)

/**
 * Middleware: Hash password before saving a user document.
 * This ensures passwords are always hashed before being stored in the database.
 */

userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next()
  this.password = bcryptjs.hash(this.password , 10)
  next()
})

/**
 * Method: Validates if the provided password matches the hashed password stored in the database.
 * @param {String} password - The plaintext password to verify.
 * @returns {Boolean} - Returns true if the password matches, false otherwise.
 */

userSchema.methods.isPasswordValid = async function (password) {
  const isValid = await bcryptjs.compare(password , this.password)
  return isValid
}

/**
 * Method: Generate an access token for the user.
 * @returns {String} - JWT access token.
 */
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
      {
          _id: this._id,
          username: this.username,
          email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // e.g., '15m'
      }
  );
};

/**
* Method: Generate a refresh token for the user.
* @returns {String} - JWT refresh token.
*/
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
      {
          _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // e.g., '7d'
      }
  );
};

const User = mongoose.model('User', userSchema);

export default User;
