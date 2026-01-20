const express = require('express');
const cors = require('cors');
require('dotenv').config()
const path = require('path')
const multer = require("multer");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);



const storage = multer.diskStorage({
  destination: "uploads/avatars",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });



const appointmentRouter = require('./routes/appointment');
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth');
const availabilityRouter = require('./routes/availability')
const pagesController = require('./routes/pages')

app.use('/appointments', appointmentRouter); 
app.use('/user', userRouter)
app.use('/auth', authRouter); 
app.use('/availability', availabilityRouter)
app.use('/pages', pagesController)

app.listen(port, () => {
  console.log('Server running at ' + port);
});

module.exports = upload;
