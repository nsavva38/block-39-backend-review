const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// token creation here
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d "});
}

const prisma = require("../prisma");


// use the token that was created from the authorization header
router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7); // slices from "Bearer {{token}}" in the http request

  if(!token) return next();

  try {
    const {id} = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({
      where: {id},
    });
    // assings the user with matching creds to the request.user
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
});


router.post("/register", async (req, res, next) => {
  // Grab credentials
  const { username, password } = req.body;
  try {
    // Create a new User w/ those credentials
    const user = await prisma.user.register(username, password);

    // Store the id into a token
    const token = createToken(user.id);

    // Send back the token
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});





router.post("/login", async (req, res, next) => {
  // Grab credentials from the user
  const { username, password } = req.body;
  try {
    // Log in the User according to the credentials, storing it in the 'user' variable
    const user = await prisma.user.login(username, password);

    // Store the id into a token
    const token = createToken(user.id);

    // Send the token back
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});



// authenticate
const authenticate = (req, res, next) => {
  if(req.user) {
    next();
  } else {
    next ({
      status: 401,
      message: "You must be logged in."
    });
  }
};

module.exports = {
  router,
  authenticate,
}