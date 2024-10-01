const { Router } = require('express')
const textRouter = Router()
require('dotenv').config()
const { auth } = require("../auth")
const { z } = require('zod')
const axios = require('axios')
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateTextGemini(textLength) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Generate a random sentence that has ${textLength * 6.5} words. make sure to not return any extra text than those words. it should be plane english without any code related words like /n or something`;

  const result = await model.generateContent(prompt);

  return result.response.text()
}


textRouter.post('/text', auth, async (req, res) => {
  const requireBody = z.object({
    textLength: z.number()
  })
  const parsedCorrectly = requireBody.safeParse(req.body)
  if (!parsedCorrectly) {
    res.status(403).json({
      message: "input validation failure"
    })
    return
  }
  const { textLength } = req.body;
  try {
    const text = await generateTextGemini(textLength);
    res.json({
      text
    })
  } catch (e) {
    console.error("error creating text: ", e)
  }
})

module.exports = {
  textRouter
}
