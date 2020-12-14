import React, { Component } from 'react';
import logo from './green-present.svg';
import './App.scss';
import soundfile from './white_christmas.mp3'
import Sound from 'react-sound'
import Cookie from 'js-cookie';
import { auth, db } from "./firebase.js";
import randomstring from 'randomstring';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showName: false,
            names: ["Sibela", "Nqkoi"],
            pickedNumber: -1,
            allNumers: []
        };
    }
    componentDidMount() {
        db.ref("names").set(this.state.names);
        db.ref("names").on("value", snapshot => {
            let allNames = [];
            snapshot.forEach(snap => {
                allNames.push(snap.val());
            });
            this.setState({ names: allNames });
        });
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
        document.getElementsByClassName('rules')[0].style.display = "none";
        document.getElementsByClassName('jump')[0].style.display = "block";
    }
    giveName() {
        this.setState({
            showName: true
        })
        document.getElementsByClassName('jump')[0].style.display = "none";

        const userCookie = Cookie.get('user');
        if (!userCookie) {
            const userString = randomstring.generate();
            Cookie.set('user', userString);
        }

        let pickedName = '';
        if (this.state.names.length == 0) {
            pickedName = "No names left";
        }

        db.ref("haveDrawn").on("value", snapshot => {
            let allUsers = [];
            snapshot.forEach(snap => {
                allUsers.push(snap.val());
            });
            if (allUsers.indexOf(userCookie) < 0) {
                allUsers.push(userCookie);
                var pickedNumber = Math.floor(Math.random() * this.state.names.length);
                pickedName = this.state.names[pickedNumber];
                const newNames = this.state.names.filter(name => name != pickedName);
                this.setState({ names: newNames });
                db.ref("names").set(newNames);
                db.ref("haveDrawn").set(allUsers);
            } else {
                pickedName = "You have already drawn";
            }
        })
        this.setState({
            pickedName: pickedName
        })
    }
    render() {
        return (
            <div className="App">
            <div className="rules">
            <h1>Taen Dqdo Koleda Pravila:</h1>
                <h2>Magicheskta kutiq shte reshi na kogo shte budesh ti Tainiqt Dqdo Koleda. Sled kato vidish imeto na
                ekrana, si go zapishi. Shte podarish podaruk na tozi chovek (na stoinost ne po-golqma ot <span>10</span> leva) i na 
                Nova Godina shte si razmenim podarucite.
                </h2>
                <button onClick={this.showBox.bind(this)}>Natisni me</button>
            </div>
            <header className="App-header">
                <img src={logo} className="jump" onClick={this.giveName.bind(this)} alt="logo" />
                {this.state.showName ? <h1>{this.state.pickedName}</h1> : ""}
            </header>
            {/* <Sound
                url={soundfile}
                playStatus={Sound.status.PLAYING}
                playFromPosition={300 /* in milliseconds */}
                onLoading={this.handleSongLoading}
                onPlaying={this.handleSongPlaying}
                onFinishedPlaying={this.handleSongFinishedPlaying}
            /> */}
            </div>
        );
    }
}

export default App;
