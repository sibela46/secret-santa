import React, { Component } from 'react';
import logo from './green-present.svg';
import './App.scss';
import soundfile from './white_christmas.mp3'
import Sound from 'react-sound'
import Cookie from 'js-cookie';
import { db } from "./firebase.js";
import randomstring from 'randomstring';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showName: false,
            allNames: ["Bozhidar", "Vanessa", "Teodora", "Mihail", "Vasil", "Vanq", "Ralitsa", "Iliyan", "Krasimir", "Roksena", "Pavel", "Iliyana", "Sibela", "Valya", "Asen Petrov", "Asen Simeonov", "Martina"],
            leftNames: [],
            drawn: [],
            pickedNumber: -1,
            allNumers: [],
            currentUser: "Bozhidar",
            soundStatus: Sound.status.STOPPED
        };
    }
    componentDidMount() {
        db.ref("names").set(this.state.allNames);
        db.ref("names").on("value", snapshot => {
            let allNames = [];
            snapshot.forEach(snap => {
                allNames.push(snap.val());
            });
            this.setState({ leftNames: allNames });
        });
        db.ref("haveDrawn").on("value", snapshot => {
            let allUsers = [];
            snapshot.forEach(snap => {
                allUsers.push(snap.val());
            });
            this.setState({ drawn: allUsers });
        });
    }
    changeCurrentUser() {
        var e = document.getElementById("names");
        console.log(e.value);
        this.setState({ currentUser: e.value });
    }
    selectName(e) {
        document.getElementsByClassName('rules')[0].style.display = "none";
        document.getElementsByClassName('input')[0].style.display = "flex";
    }
    showBox() {
        document.getElementsByClassName('input')[0].style.display = "none";
        document.getElementsByClassName('jump')[0].style.display = "flex";
        document.getElementsByClassName('App-header')[0].style.display = "flex"; 
    }
    giveName() {
        this.setState({ showName: true, soundStatus: Sound.status.PLAYING });
        document.getElementsByClassName('jump')[0].style.display = "none";

        let userCookie = Cookie.get('user');
        if (!userCookie) {
            userCookie = randomstring.generate();
            Cookie.set('user', userCookie);
        }

        let pickedName = '';
        const userHasDrawn = this.state.drawn.find(drawnData => drawnData.cookie === userCookie || drawnData.name === this.state.currentUser);
        if (userHasDrawn) {
            pickedName = userHasDrawn.pickedName;
            this.setState({ pickedName: "Veche si teglil. Tvoqt chovek e " + pickedName });
        } else {
            pickedName = this.pickName();
        }
    }
    pickName() {
        let userCookie = Cookie.get('user');
        let newlyDrawn = this.state.drawn;
        var pickedNumber = Math.floor(Math.random() * this.state.leftNames.length);
        let pickedName = this.state.leftNames[pickedNumber];
        // User cannot draw this name if they have drawn themselves or if they have drawn a person who is their own secret santa
        let userSecretSanta = this.state.drawn.find(drawnData => drawnData.name === pickedName);
        let twoSidedSanta = false;
        if (userSecretSanta) {
            twoSidedSanta = userSecretSanta.pickedName === this.state.currentUser;
        }
        let cannotDrawThisName = pickedName === this.state.currentUser || twoSidedSanta;
        while (cannotDrawThisName) {
            pickedNumber = Math.floor(Math.random() * this.state.leftNames.length);
            pickedName = this.state.leftNames[pickedNumber];

            twoSidedSanta = userSecretSanta.pickedName === this.state.currentUser;
            cannotDrawThisName = pickedName === this.state.currentUser || twoSidedSanta;
        }
        let obj = { cookie: userCookie, name: this.state.currentUser, pickedName: pickedName };
        newlyDrawn.push(obj);
        const newNames = this.state.leftNames.filter(name => name !== pickedName);
        db.ref("names").set(newNames);
        db.ref("haveDrawn").set(newlyDrawn);
        this.setState({ leftNames: newNames, pickedName: pickedName });

        return pickedName;
    }
    render() {
        return (
            <div className="App">
                <Sound
                    url={soundfile}
                    playStatus={this.state.soundStatus}
                    playFromPosition={400 /* in milliseconds */}
                    onLoading={this.handleSongLoading}
                    onPlaying={this.handleSongPlaying}
                    onFinishedPlaying={this.handleSongFinishedPlaying}
                />
            <div className="rules">
            <h1>Taen Dqdo Koleda Pravila:</h1>
                <h2>Magicheskta kutiq shte reshi na kogo da budesh Tainiqt Dqdo Koleda. Sled kato vidish imeto na
                ekrana, si go zapishi. Shte podarish podaruk na tozi chovek (na stoinost ne po-golqma ot <span>10</span> leva) i na 
                Nova Godina shte si razmenim podarucite.
                </h2>
                <button onClick={this.selectName.bind(this)}>Natisni me</button>
            </div>
            <div className="input">
                <label className="label" for="names">Koi si ti?</label>
                <select name="names" id="names" onChange={this.changeCurrentUser.bind(this)}>
                    {this.state.allNames.map(name => (
                        <option value={name}>{name}</option>
                    ))}
                </select>
                <button className="small" onClick={this.showBox.bind(this)}>Iztegli ime</button>
            </div>
            <header className="App-header">
                <img src={logo} className="jump" onClick={this.giveName.bind(this)} alt="logo" />
                {this.state.showName ? <h1>{this.state.pickedName}</h1> : ""}
            </header>
            </div>
        );
    }
}

export default App;
