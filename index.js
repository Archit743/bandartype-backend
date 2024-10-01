const express = require('express')
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user');
const { textRouter } = require('./routes/text');
const app = express()
require('dotenv').config();
const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use('/api/user', userRouter);
app.use('/api/text', textRouter)


async function main() {
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
  })
}
main()

