import React, { Component } from 'react';
import logo from './green-present.svg';
import './App.css';
import soundfile from './white_christmas.mp3'
import Sound from 'react-sound'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showName: false
    };
  }
  giveName() {
    this.setState({
      showName: true
    });
    document.getElementsByClassName('jump')[0].style.display = "none";
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="jump" onClick={this.giveName.bind(this)} alt="logo" />
          {this.state.showName ? <h1>Name</h1> : ""}
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <Sound
          url={soundfile}
          playStatus={Sound.status.PLAYING}
          playFromPosition={300 /* in milliseconds */}
          onLoading={this.handleSongLoading}
          onPlaying={this.handleSongPlaying}
          onFinishedPlaying={this.handleSongFinishedPlaying}
        />
      </div>
    );
  }
}

export default App;
