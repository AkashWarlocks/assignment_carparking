const mongoose = require('mongoose');

MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/parking"

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
