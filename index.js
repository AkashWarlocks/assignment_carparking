const express = require('express');
const allotParkingRoutes = require('./routes/allotparking.route')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express ();

const port = process.env.PORT || 3000;
app.use(
    bodyParser.json()
)
app.use(cors())
app.use(express.static(__dirname + '/dist/parking-frontend'));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,X-Frame-Options, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(allotParkingRoutes)

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});



