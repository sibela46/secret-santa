import React, { Component } from 'react';
import logo from './green-present.svg';
import './App.scss';
import soundfile from './white_christmas.mp3'
import Sound from 'react-sound'
import cookie from 'react-cookies';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showName: false,
      names: ['Callum', 'Jack', 'Elias', 'Katie', 'Palvi', 'Myles', 'James', 'Sisi'],
      cookieNames: cookie.loadAll(),
      pickedNumber: -1,
      allNumers: []
    };
  }
  componentWillMount() {
    for(var i = 0; i < this.state.names.length; i++) {
      cookie.save('name' + i, this.state.names[i], { path: '/' });
    }
  }
  contains(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
  }
  showBox() {
    for (var i=0; i < this.state.names.length; i++) {
      this.setState({ cookieNames: cookie.load('name' + i)})
    }
    document.getElementsByClassName('rules')[0].style.display = "none";
    document.getElementsByClassName('jump')[0].style.display = "block";
  }
  giveName(event) {
    this.setState({
      showName: true
    })
    document.getElementsByClassName('jump')[0].style.display = "none";
    var pickedNumber = Math.floor(Math.random() * 8);
    var pickedName = cookie.load('name' + pickedNumber);
    var allNumbers = []
    while (pickedName === undefined) {
      pickedNumber = Math.floor(Math.random() * 8);
      if (!this.contains.call(allNumbers, pickedNumber)) {
        allNumbers.push(pickedNumber);
      }
      if (allNumbers.length == 8) {
        pickedName = "No names left";
        break;
      }
      pickedName = cookie.load('name' + pickedNumber);
    }
    this.setState({
      pickedName: pickedName
    })
    cookie.remove('name' + pickedNumber, {path: '/'})
    console.log(cookie.loadAll());
  }
  render() {
    return (
      <div className="App">
        <div className="rules">
        <h1>Secret Santa Rules:</h1>
          <h2><span>1.</span> Draw a name from the magic box</h2>
          <h2><span>2.</span> You will then be a Secret Santa to that person...</h2>
          <h2><span>3.</span> Which means you will have to buy them a cute little gift (no more than <span>£10</span> worth)</h2>
          <h2><span>4.</span> Are you ready to draw a name?</h2>
          <button onClick={this.showBox.bind(this)}>Click me</button>
        </div>
        <header className="App-header">
          <img src={logo} className="jump" onClick={this.giveName.bind(this)} alt="logo" />
          {this.state.showName ? <h1>{this.state.pickedName}</h1> : ""}
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
