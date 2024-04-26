const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  // For demonstration purposes, always consider any login attempt as successful
  // without validating the password
  if (!existingUser) {
    // Create a new user with random values
    existingUser = new User({
      name: uuid(),
      email: email,
      password: uuid() // You can use any random value for password
    });
    await existingUser.save(); // Save the "user" in the database
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true }),
    token: token
  });
};
