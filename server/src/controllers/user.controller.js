import User from '../models/user.model'

export const userSignUp = async (req, res) => {
  const validationResponse = SignUpSchema.safeParse(req.body);

  if (!validationResponse.success) {
    return res.status(400).json({
      success: false,
      message: 'Input is invalid, please try again.',
    });
  }

  const { username, password, email } = req.body;

  try {
    const isUserAlreadyExist = await User.findOne({ username });
    if (isUserAlreadyExist) {
      return res.status(409).json({
        success: false,
        message: 'User already exists.',
      });
    }

    const hashPass = await handleHashPassword(password);

    const newUser = new User({
      username,
      email,
      password: hashPass,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY, {
      expiresIn: '1d',
    });

    res
      .status(201)
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: 'User created successfully.',
      });
  } catch (error) {
    console.error('Error in UserSignUp controller:', error);
    next(error);
  }
};


export const userLogin = async (req, res) => {
  // Logic for logging in
};


export const userLogout = async (req, res) => {
  // Logic for logging out
};


export const userPurchaseCourse = async (req, res) => {
  //logic for purchase course
};


export const userGetAllCourses = async (req, res) => {
  // Logic to get all courses
};


export const userGetPurchasedCourses = (req, res) => {
  // Logic to get all courses
};


export const userDeletePurchasedCourse = (req, res) => {
  // Logic for deleting a purchased course
};
