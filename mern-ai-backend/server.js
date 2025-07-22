const User = require("./models/User");

require("dotenv").config();
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);

const express=require('express');
const usersRouter=require("./routes/usersRouter");
const cookieParser=require("cookie-parser");
const cron=require("node-cron");
const cors=require("cors");
require('./utils/connectDB')(); 


require("dotenv").config();
const { startSession } = require('mongoose');
const { errorHandler } = require('./middlewares/errorMiddleware');
const openAIRouter = require('./routes/openAIRouter');
const razorRouter = require('./routes/razorRouter');
const app=express();
const PORT=process.env.port || 8090;


//Cron for the trial period : run every single
cron.schedule("0 0 * * * *", async () => {
  console.log("This task runs every second");
  try {
    //get the current date
    const today = new Date();
    const updatedUser = await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        trialActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 5,
      }
    );
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//Cron for the Free plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Cron for the Basic plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Cron for the Premium plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//Cron paid plan

// middlewares
app.use(express.json()); 
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
// routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/razorpay", require("./routes/razorRouter")); 

app.use('/api/v1', require('./routes/contentHistoryRouter'));
// errorhandler
app.use(errorHandler);

// 601
// start the server
app.listen(PORT,console.log(`Server is running on port ${PORT}`));
