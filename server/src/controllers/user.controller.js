import Courses from '../models/courses.model';
import User from '../models/user.model';
import AppError from '../utils/AppError';
import uploadToCloudinary from '../utils/Cloudinary';
import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/AsyncHandler';

export const userSignUp = asyncHandler( async (req, res) => {
  const validationResponse = SignUpSchema.safeParse(req.body);

  //step 1 validation for user input
  if (!validationResponse.success) {
    throw new AppError(
      'Input is invalid',
      403,
      validationResponse.errors.error
    );
  }

  const { username, password, email } = req.body;

  //step 2: check for the existing user present or not

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new AppError('User already exist', 409);
  }

  //setp 3: handle upload profile picture upload on local storage

  const localProfilePicturePath = req.files?.profilePicture?.[0]?.path;

  if (!localProfilePicturePath) {
    throw new AppError('something went wrong while uploading profile', 400);
  }

  //setp 4: Upload profile picture on cloudinary

  const profilePicture = await uploadToCloudinary(localProfilePicturePath);

  if (!profilePicture) {
    throw new AppError('unable to upload profilePicture' , 400);
  }

  //step 5 create new user

  const newUser = await User.create({
    username,
    email,
    password,
    profilePicture
  });

  //step 6 remove sensitive field from the user

  const newCreatedUser = await User.findById(newUser._id).select(
    '-password - refreshToken'
  )

  if(!newCreatedUser){
    throw new AppError("Error while creating user",500)
  }

  //step 7: send response to frontend
  res.status(201).json(
    new ApiResponse(200 , "user signup successfully" , newCreatedUser)
  )
})




export const userLogin = async (req, res) => {
  const validationResponse = loginSchema.safeParse(req.body);

  if (!validationResponse.success) {
    return res.status(400).json({
      success: false,
      message: 'Input is invalid, please try again.',
      errors: validationResponse.error.errors,
    });
  }

  const { username, password } = req.body;

  try {
    const isUserExist = await User.findOne({ username });
    if (!isUserExist) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    const validatePassword = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!validatePassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    const token = jwt.sign({ UserId: isUserExist._id }, process.env.JWT_KEY, {
      expiresIn: '1d',
    });

    res
      .status(200)
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: 'User logged in successfully.',
      });
  } catch (error) {
    console.error('Error in Login controller:', error);
    next(error);
  }
};

export const userLogout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });

  res.status(200).json({
    message: 'Logged out successfully',
  });
};

export const userPurchaseCourse = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please log in first',
      });
    }

    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { purchasedCourses: courseId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course purchased successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error purchasing course:', error);
    next(error);
  }
};

export const userGetAllCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Courses.find();

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No courses available',
      });
    }

    // Send the list of courses to the client
    res.status(200).json({
      success: true,
      message: 'Courses fetched successfully',
      courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    next(error);
  }
};

export const userGetPurchasedCourses = async (req, res) => {
  try {
    const userId = req.user?.userId; // Assuming the user ID is stored in req.user

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: 'Please log in first',
      });
    }

    // Find the user and populate the purchased courses
    const user = await User.findById(userId).populate('purchasedCourses');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.purchasedCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No purchased courses found',
      });
    }

    // Send the list of purchased courses to the client
    res.status(200).json({
      success: true,
      message: 'Purchased courses fetched successfully',
      courses: user.purchasedCourses,
    });
  } catch (error) {
    console.error('Error fetching purchased courses:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export const userDeletePurchasedCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Please log in to delete purchased courses.',
    });
  }

  try {
    // Ensure the course exists
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Remove the courseId from the user's purchasedCourses array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { purchasedCourses: courseId } }, // $pull removes the courseId from the array
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Course removed from your purchased list.',
      updatedUser,
    });
  } catch (error) {
    console.error('Error deleting purchased course:', error);
    next(error);
  }
};
