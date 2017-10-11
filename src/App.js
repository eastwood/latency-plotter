import React, { Component } from 'react';
import request from 'request';
import {Button, Grid, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      samples: []
    };

    this.onBlur = this.onBlur.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  componentDidMount() {
    window.Plotly.plot('graph', [{
      y: [],
      mode: 'lines',
      line: {color: '#80CAF6'}
    }]);
  }

  onClear(e) {
    e.preventDefault();
    if (this.state.interval) {
      console.log('clearing interval');
      window.clearInterval(this.state.interval);
      this.setState({
        interval: null,
        samples: []
      });
    }
  }

  onBlur(e) {
    const url = e.target.value;
    const interval = window.setInterval(() => {
      request({
        url,
        time: true
      }, (err, response, body) => {
        console.log(this.state.samples);
        this.state.samples.push(response.timingPhases.total);
        window.Plotly.extendTraces('graph', {
          y: [[response.timingPhases.total]]
        }, [0]);
      });
    }, 100);

    this.setState({
      interval
    });

  }
  
  render() {
    return (
      <div>
        <header className="header">
          <h1>Plot Your Latency</h1>
          <hr/>
        </header>
        <Grid className="container">
          <form>
            <FormGroup controlId="hostname">
              <ControlLabel>Hostname</ControlLabel>
              <FormControl
                onBlur={this.onBlur}
                type="text"
                defaultValue="http://dynamodb.ap-southeast-2.amazonaws.com/ping"
                placeholder="Enter Hostname"
                />
            </FormGroup>
            <Button
              onClick={this.onClear}
            >
              Reset
            </Button>
          </form>
          <div id="graph"/>
        </Grid>
      </div>
    );
  }
}

export default App;
