const mongoose = require('mongoose');

MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/parking"
MONGODB_URL_SERVER = "mongodb+srv://userDB:aaouikika@bingbot-3awwl.mongodb.net/parking?retryWrites=true"
mongoose.connect(MONGODB_URL_SERVER, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
