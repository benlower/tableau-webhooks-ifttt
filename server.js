// server.js
// where your node app starts


// init project
let fs = require('fs');
let path = require('path');
let rp = require('request-promise-native');
let express = require('express');
let app = express();
const IFTTT_URL = 'https://maker.ifttt.com/trigger/'; //datasource/with/key/';
const LOGO_FILE = path.join(__dirname, './tableauwebhooks.txt');
let iftttBody = {
  "value1": "",
  "value2": "",
  "value3": ""
};
let rpMsg = '';
let options = {
  method: 'POST',
  uri: '',
  body: {},
  json: true
};

// set-up middleware
app.use(express.json());

// routes
app.get('/', function(req, res) {
  res.status(200);
  res.send('Hi. This app only speaks REST.');
});

app.post('/incoming', (req, res) => {
  console.log("Incoming request..." + JSON.stringify(req.body));
  iftttBody.value1 = req.body['resource-name'];
  // iftttBody.value2 = req.body.event;
  // iftttBody.value3 = req.body.name;

  options.body = iftttBody;
  
  // use the IFTTT event specified in our incoming body
  if(req.body['event-type']) {
    console.log('here');
    options.uri = IFTTT_URL + path.join(req.body['event-type'], 'with/key/', process.env.IFTTT_KEY);
    
    rp(options)
    .then(function (parsedBody) {
      rpMsg = 'Sent message to IFTTT: ' + JSON.stringify(options.body);
      res.status(200);
      res.send(rpMsg);
    })
    .catch(function (err) {
      rpMsg = 'There was a problem sending to IFTTT.' + err;
      res.status(500);
      res.send(rpMsg);
    });
  } else {
    res.status(200);
    res.send();
  }

  
});

// start up our app & listen for requests
let listener = app.listen(process.env.PORT, function() {
  fs.readFile(LOGO_FILE, 'utf8', function(err, data) {
    if(err) throw err;
    console.log('\n %s', data);
    console.log('App started on port ' + listener.address().port);
  });
});