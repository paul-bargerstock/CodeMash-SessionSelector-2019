const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

app.get('/api/getSessions', cors(), (request, response) => {
    fs.readFile(__dirname + '/public/sessions.json', (err, data) => {
        if (err) throw err;
        response.send(JSON.parse(data));
    });
});

app.options('/api/saveSessions', cors());
app.post('/api/saveSessions', cors(), (request, response) => {    
    fs.writeFile(__dirname + '/public/sessions.json', JSON.stringify(request.body), (err, data) => {
      response.send("sessions saved");
    });    
});

app.get('/api/clear', cors(), (request, response) => {
    fs.writeFile(__dirname + '/public/sessions.json', JSON.stringify(initialData), (err, data) => {
      response.send(initialData);
    });    
});

const port = process.env.PORT || 5000;
app.listen(port);

const initialData = 
{
    tuesday: [
        {
          time: "2019-01-08T08:00:00",
          session: {}
        },
        {
          time: "2019-01-08T13:00:00",
          session: {}
        }
      ],
      wednesday: [
        {
          time: "2019-01-09T08:00:00",
          session: {}
        },
        {
          time: "2019-01-09T13:00:00",
          session: {}
        }
      ],
      thursday: [
        {
          time: "2019-01-10T08:00:00",
          session: {}
        },
        {
          time: "2019-01-10T09:15:00",
          session: {}
        },
        {
          time: "2019-01-10T10:30:00",
          session: {}
        },
        {
          time: "2019-01-10T11:45:00",
          session: {}
        },
        {
          time: "2019-01-10T13:00:00",
          session: {}
        },
        {
          time: "2019-01-10T15:30:00",
          session: {}
        },
        {
          time: "2019-01-10T16:45:00",
          session: {}
        }
      ],
      friday: [
        {
          time: "2019-01-11T08:30:00",
          session: {}
        },
        {
          time: "2019-01-11T09:45:00",
          session: {}
        },
        {
          time: "2019-01-11T11:00:00",
          session: {}
        },
        {
          time: "2019-01-11T12:15:00",
          session: {}
        },
        {
          time: "2019-01-11T14:45:00",
          session: {}
        },
        {
          time: "2019-01-11T16:00:00",
          session: {}
        }
      ]
}

console.log('App is listening on port ' + port);