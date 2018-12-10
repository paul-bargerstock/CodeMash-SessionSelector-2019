import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import { Button, Grid, Modal } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedSessions: {
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
      },
      filteredSessions: [],
      mappedSessions: {
        tuesday: [
          {
            time: "2019-01-08T08:00:00",
            sessions: []
          },
          {
            time: "2019-01-08T13:00:00",
            sessions: []
          }
        ],
        wednesday: [
          {
            time: "2019-01-09T08:00:00",
            sessions: []
          },
          {
            time: "2019-01-09T13:00:00",
            sessions: []
          }
        ],
        thursday: [
          {
            time: "2019-01-10T08:00:00",
            sessions: []
          },
          {
            time: "2019-01-10T09:15:00",
            sessions: []
          },
          {
            time: "2019-01-10T10:30:00",
            sessions: []
          },
          {
            time: "2019-01-10T11:45:00",
            sessions: []
          },
          {
            time: "2019-01-10T13:00:00",
            sessions: []
          },
          {
            time: "2019-01-10T15:30:00",
            sessions: []
          },
          {
            time: "2019-01-10T16:45:00",
            sessions: []
          }
        ],
        friday: [
          {
            time: "2019-01-11T08:30:00",
            sessions: []
          },
          {
            time: "2019-01-11T09:45:00",
            sessions: []
          },
          {
            time: "2019-01-11T11:00:00",
            sessions: []
          },
          {
            time: "2019-01-11T12:15:00",
            sessions: []
          },
          {
            time: "2019-01-11T14:45:00",
            sessions: []
          },
          {
            time: "2019-01-11T16:00:00",
            sessions: []
          }
        ]
      }
    };
  };


  async componentDidMount() {
    var savedResponse = await axios.get('http://localhost:5000/api/getSessions');
    const savedSessions = savedResponse.data;

    var codemashResponse = await axios.get('https://sessionize.com/api/v2/mqm7pgek/view/sessions');
    const allSessions = codemashResponse.data[0].sessions;

    const mappedSessions = JSON.parse(JSON.stringify(this.state.mappedSessions));

    mappedSessions.tuesday.forEach(x => {
      x.sessions = allSessions.filter(s => s.startsAt === x.time);
    });

    mappedSessions.wednesday.forEach(x => {
      x.sessions = allSessions.filter(s => s.startsAt === x.time);
    });

    mappedSessions.thursday.forEach(x => {
      x.sessions = allSessions.filter(s => s.startsAt === x.time);
    });

    mappedSessions.friday.forEach(x => {
      x.sessions = allSessions.filter(s => s.startsAt === x.time);
    });

    this.setState({ savedSessions, mappedSessions, initialized: true });
  };

  selectSession(day, time, sessionId) {
    const savedSessions = JSON.parse(JSON.stringify(this.state.savedSessions));
    savedSessions[day].find(x => x.time === time).session = this.state.filteredSessions.find(y => y.id === sessionId);
    axios.post("http://localhost:5000/api/saveSessions", savedSessions).then(resp => {
      this.setState({ savedSessions });
    });
  };

  filterSessions(day, time) {
    const filteredSessions = this.state.mappedSessions[day].filter(x => x.time === time)[0].sessions;
    this.setState({ filteredSessions, filteredTime: time });
  }

  clearSessions() {
    axios.get("http://localhost:5000/api/clear").then(savedSessions => {
      this.setState({ savedSessions: savedSessions.data });
    });
  };

  render() {
    return (
      !this.state.initialized ? null :
        <div style={{backgroundColor: "#eee"}}>
          <div style={{ height: "5em", paddingTop: "1em", display: "flex", alignItems: "center" }}>
            <img src='./images/codemash-logo.png' alt="codemash" style={{ maxHeight: "100%", maxWidth: "100%", paddingLeft: "2em" }} />
            <div><h2 style={{ paddingLeft: "1em" }}>CodeMash 2019</h2></div>
          </div>
          <div style={{paddingTop: "1em", paddingLeft: "2em"}}><Button color="red" content="Clear All" onClick={() => {this.clearSessions()}}/></div>
          <Grid style={{ padding: "3em" }}>

            <Grid.Row>
              <Grid.Column width={4} style={{padding: "2em", borderRadius: "25px", borderRight: "solid 1px gray", borderLeft: "solid 1px gray", backgroundColor: "#ccc"}}>
                <h4>Tuesday (Precompilers)</h4>
                {
                  this.state.savedSessions.tuesday.map(timeslot =>
                    <div key={timeslot.time} style={{ paddingTop: "1em" }}>
                      <p>{moment(timeslot.time).format("dddd, h:mm A")}</p>
                      <Button
                        color="black"
                        content={timeslot.session.title ? timeslot.session.title : "Select..."}
                        onClick={() => { this.filterSessions("tuesday", timeslot.time); this.setState({ showTuesdayModal: true }) }}
                      />
                      <Modal open={this.state.showTuesdayModal} closeIcon={true} onClose={() => { this.setState({ showTuesdayModal: false }) }} size="large">
                        <Modal.Header>{moment(this.state.filteredTime).format("dddd, MMMM Do, h:mm A")}</Modal.Header>
                        <Modal.Content>

                          <Modal.Description>
                            {
                              this.state.filteredSessions.map(session =>
                                <Grid key={session.id} style={{borderBottom: "1px solid grey"}}>
                                  <Grid.Row>
                                    <Grid.Column width={4}>
                                      <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{fontWeight: "bold"}}>{session.title}</div>   
                                        <div style={{paddingTop: "1em", paddingBottom: "1em"}}>{session.speakers[0].name}</div>                               
                                        <div><Button onClick={() => {
                                          this.selectSession("tuesday", this.state.filteredTime, session.id);
                                          this.setState({ showTuesdayModal: false })
                                        }}
                                          content="Choose" /></div>
                                      </div>
                                    </Grid.Column>
                                    <Grid.Column width={12}>{session.description}</Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              )
                            }
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                    </div>
                  )
                }
              </Grid.Column>
              <Grid.Column width={4} style={{padding: "2em", borderRadius: "25px", borderRight: "solid 1px gray", borderLeft: "solid 1px gray", backgroundColor: "#ccc"}}>
                <h4>Wednesday (Precompilers)</h4>
                {
                  this.state.savedSessions.wednesday.map(timeslot =>
                    <div key={timeslot.time} style={{ paddingTop: "1em" }}>
                      <p>{moment(timeslot.time).format("dddd, h:mm A")}</p>
                      <Button
                        color="black"
                        content={timeslot.session.title ? timeslot.session.title : "Select..."}
                        onClick={() => { this.filterSessions("wednesday", timeslot.time); this.setState({ showWednesdayModal: true }) }}
                      />
                      <Modal open={this.state.showWednesdayModal} closeIcon={true} onClose={() => { this.setState({ showWednesdayModal: false }) }} size="large">
                      <Modal.Header>{moment(this.state.filteredTime).format("dddd, MMMM Do, h:mm A")}</Modal.Header>
                        <Modal.Content>

                          <Modal.Description>
                            {
                              this.state.filteredSessions.map(session =>
                                <Grid key={session.id} style={{borderBottom: "1px solid grey"}}>
                                  <Grid.Row>
                                    <Grid.Column width={4}>
                                      <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{fontWeight: "bold"}}>{session.title}</div>   
                                        <div style={{paddingTop: "1em", paddingBottom: "1em"}}>{session.speakers[0].name}</div>    
                                        <div><Button onClick={() => {
                                          this.selectSession("wednesday", this.state.filteredTime, session.id);
                                          this.setState({ showWednesdayModal: false })
                                        }}
                                          content="Choose" /></div>
                                      </div>
                                    </Grid.Column>
                                    <Grid.Column width={12}>{session.description}</Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              )
                            }
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                    </div>
                  )
                }
              </Grid.Column>
              <Grid.Column width={4} style={{padding: "2em", borderRadius: "25px", borderRight: "solid 1px gray", borderLeft: "solid 1px gray", backgroundColor: "#ccc"}}>
                <h4>Thursday</h4>
                {
                  this.state.savedSessions.thursday.map(timeslot =>
                    <div key={timeslot.time} style={{ paddingTop: "1em" }}>
                      <p>{moment(timeslot.time).format("dddd, h:mm A")}</p>
                      <Button
                        color="black"
                        content={timeslot.session.title ? timeslot.session.title : "Select..."}
                        onClick={() => { this.filterSessions("thursday", timeslot.time); this.setState({ showThursdayModal: true }) }}
                      />
                      <Modal open={this.state.showThursdayModal} closeIcon={true} onClose={() => { this.setState({ showThursdayModal: false }) }} size="large">
                      <Modal.Header>{moment(this.state.filteredTime).format("dddd, MMMM Do, h:mm A")}</Modal.Header>
                        <Modal.Content>

                          <Modal.Description>
                            {
                              this.state.filteredSessions.map(session =>
                                <Grid key={session.id} style={{borderBottom: "1px solid grey"}}>
                                  <Grid.Row>
                                    <Grid.Column width={4}>
                                      <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{fontWeight: "bold"}}>{session.title}</div>   
                                        <div style={{paddingTop: "1em", paddingBottom: "1em"}}>{session.speakers[0].name}</div>    
                                        <div><Button onClick={() => {
                                          this.selectSession("thursday", this.state.filteredTime, session.id);
                                          this.setState({ showThursdayModal: false })
                                        }}
                                          content="Choose" /></div>
                                      </div>
                                    </Grid.Column>
                                    <Grid.Column width={12}>{session.description}</Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              )
                            }
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                    </div>
                  )
                }
              </Grid.Column>
              <Grid.Column width={4} style={{padding: "2em", borderRadius: "25px", borderRight: "solid 1px gray", borderLeft: "solid 1px gray", backgroundColor: "#ccc"}}>
                <h4>Friday</h4>
                {
                  this.state.savedSessions.friday.map(timeslot =>
                    <div key={timeslot.time} style={{ paddingTop: "1em" }}>
                      <p>{moment(timeslot.time).format("dddd, h:mm A")}</p>
                      <Button
                        color="black"
                        content={timeslot.session.title ? timeslot.session.title : "Select..."}
                        onClick={() => { this.filterSessions("friday", timeslot.time); this.setState({ showFridayModal: true }) }}
                      />
                      <Modal open={this.state.showFridayModal} closeIcon={true} onClose={() => { this.setState({ showFridayModal: false }) }} size="large">
                      <Modal.Header>{moment(this.state.filteredTime).format("dddd, MMMM Do, h:mm A")}</Modal.Header>
                        <Modal.Content>

                          <Modal.Description>
                            {
                              this.state.filteredSessions.map(session =>
                                <Grid key={session.id} style={{borderBottom: "1px solid grey"}}>
                                  <Grid.Row>
                                    <Grid.Column width={4}>
                                      <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{fontWeight: "bold"}}>{session.title}</div>   
                                        <div style={{paddingTop: "1em", paddingBottom: "1em"}}>{session.speakers[0].name}</div>    
                                        <div><Button onClick={() => {
                                          this.selectSession("friday", this.state.filteredTime, session.id);
                                          this.setState({ showFridayModal: false })
                                        }}
                                          content="Choose" /></div>
                                      </div>
                                    </Grid.Column>
                                    <Grid.Column width={12}>{session.description}</Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              )
                            }
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                    </div>
                  )
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

export default App;
