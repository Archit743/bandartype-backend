const { Router } = require('express')
const userRouter = Router();
const { UserModel } = require('../db')
const { z } = require('zod')
const bcrypt = require('bcrypt')
const { UserSecret, jwt, auth } = require('../auth')

userRouter.post('/signup', async (req, res) => {
  const requiredBody = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(3).max(100)
  })
  const parsedCorrectly = requiredBody.safeParse(req.body);
  if (!parsedCorrectly) {
    res.status(403).json({
      message: "input validation failed"
    })
    return
  }
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 6)
  try {
    UserModel.create({
      name: name,
      email: email,
      password: hashedPassword
    })
  } catch (e) {
    console.error("error creating password: ", e)
    return;
  }
  res.json({
    message: "you are signed up"
  })
})

userRouter.post('/signin', async (req, res) => {
  const requiredBody = z.object({
    email: z.string().email(),
    password: z.string()
  })
  const parsedCorrectly = requiredBody.safeParse(req.body);
  if (!parsedCorrectly) {
    res.status(403).json({
      message: "input validation failed"
    })
    return
  }
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email })
  if (!user) {
    res.status(403).json({
      message: "user does not exist"
    })
    return
  }
  const passwordMatched = await bcrypt.compare(password, user.password)
  if (passwordMatched) {
    const token = jwt.sign({
      email: user.email
    }, UserSecret)
    res.json({
      token
    })
  } else {
    res.status(403).json({
      message: "invalid creds"
    })
  }
})

userRouter.get('/check', auth, (req, res) => {
  res.send("you have access to the app")
})


module.exports = {
  userRouter
}
