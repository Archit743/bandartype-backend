const express = require('express')
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user');
const { textRouter } = require('./routes/text');
const app = express()
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const cors = require('cors')

const keepServerAlive = () => {
  setTimeout(() => {
    console.log('Performing a dummy task to keep the server alive...');
    const now = new Date();
    console.log(`Server pinged at ${now.toISOString()}`);

    // Recursively call keepServerAlive to set the next timeout
    keepServerAlive();
  }, 840000);
};

keepServerAlive()


app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
app.use('/api/user', userRouter);
app.use('/api/text', textRouter)


async function main() {
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
  })
}
main()

