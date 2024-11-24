import React, { Component } from 'react';
import logo from './green-present.svg';
import './App.scss';
import soundfile from './white_christmas.mp3'
import Sound from 'react-sound'
import Cookie from 'js-cookie';
import randomstring from 'randomstring';
import Swal from 'sweetalert2';
import "./firebase";
import { getNames, getDrawn, setNames, setDrawn } from './firebase';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showName: false,
            allNames: ["Албена", "Анастас", "Ерол", "Елена", "Джуна", "Климент", "Миглена", "Михаил", "Сибела", "Цанислав"],
            allPasswords: {
                "Албена": "ajdoel859",
                "Анастас": "jkdsi430", 
                "Ерол": "ko3943js",
                "Елена": "hdfsa23d",
                "Джуна": "jdksa622",
                "Климент": "oiuopfd43",
                "Миглена": "hdsamk95",
                "Михаил": "hdslahi53",
                "Сибела": "fdafdj783",
                "Цанислав": "cghxads643"
            },
            leftNames: [],
            drawn: [],
            pickedNumber: -1,
            allNumers: [],
            currentUser: "Албена",
            password: "",
            pickedName: "",
            questionnaire: { 1: { question: "Ако имаше двадесет и четири часа, в които можеше да правиш абсолютно всичко на света, какво щеше да правиш?", answer: "" },
            2: { question:"Довърши изречението. Аз съм таен експерт в...", answer: "" },
            3: { question: "Тази Коледа решаваш да раздадеш всичките си вещи без три от тях. Какво ще задържиш?", answer: "" },
            4: { question: "Какво е нещото, което може да гледаш или да четеш винаги без никога да ти омръзне?", answer: "" },
            5: { question: "Какво е нещото, което хората си мислят, че харесваш, но всъщност тайно не го?", answer: "" },
            6: { question: "Кой е най-хубавият подарък, който някога си получавал/а?", answer: "" },
            7: { question: "А имаш ли конкретни желания за подарък?", answer: "" },
            8: { question: "И накрая... какво очакваш с най-голямо нетърпение през идната година?", answer: "" }},
            pickedNameAnswers: {},
            soundStatus: Sound.status.STOPPED
        };
    }
    componentDidMount() {
        this.state.allNames.sort();
        //setNames(this.state.allNames);
        getNames().then(res => {            
            let names = []
            res.forEach(doc => {
                console.log(doc);
                names.push(...doc.names);
            })            
            this.setState({ leftNames: names });
        }).catch(err => {
            console.error(err);
        })
        getDrawn().then(res => {
            let names = []
            res.forEach(doc => {
                console.log(doc);
                names.push(...doc.names);
            })            
            this.setState({ drawn: names });
        }).catch(err => {
            console.error(err);
        })        
    }
    changeCurrentUser() {
        var e = document.getElementById("names");
        this.setState({ currentUser: e.value });
    }
    changeAnswer(e, id) {
        var e = document.getElementById("gift" + id);
        this.setState(prevState => ({
            questionnaire: Object.values(prevState.questionnaire).map((el, elId) => {
               return elId === id ? { ...el, answer: e.value } : el
            })
        }));
    }
    authenticate(e) {
        document.getElementsByClassName('rules')[0].style.display = "none";
        document.getElementsByClassName('authenticate')[0].style.display = "flex";        
    }
    changePassword(e) {
        var e = document.getElementById("password");
        this.setState({ password: e.value });
    }
    selectName(e) {
        if (this.state.allPasswords[this.state.currentUser] !== this.state.password) {
            Swal.fire({
                title: 'Грешна парола!',
                text: "Или си Гринч, който иска да види на кого е Таен Дядо Коледа " + this.state.currentUser +", или си си забравил паролата. Ако е второто, попитай Сибела.",
                icon: 'error',
                confirmButtonText: 'ОК',
                confirmButtonColor: "#d42426"
            });
            return;
        }        
        document.getElementsByClassName('authenticate')[0].style.display = "none";
        let userCookie = Cookie.get('user');
        
        const userHasDrawn = this.state.drawn.find(drawnData => drawnData.cookie === userCookie || drawnData.name === this.state.currentUser);
        if (userHasDrawn) {
            let pickedName = userHasDrawn.pickedName;
            const pickedNameData = this.state.drawn.find(drawnData => drawnData.name === pickedName);
            let pickedNameQuestionnaire = {};
            if (pickedNameData) {
                pickedNameQuestionnaire = pickedNameData.questionnaire;
            }
            this.setState({ showName: true, soundStatus: Sound.status.PLAYING, pickedName: pickedName, pickedNameAnswers: pickedNameQuestionnaire});
            document.getElementsByClassName('App-header')[0].style.display = "flex"; 
        }
        else {
            document.getElementsByClassName('questions')[0].style.display = "flex";
        }
    }
    showBox() {
        document.getElementsByClassName('questions')[0].style.display = "none";
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
            this.setState({ pickedName: pickedName });
        } else {
            pickedName = this.pickName();
            this.setState({ pickedName: pickedName });
        }
        
        const pickedNameData = this.state.drawn.find(drawnData => drawnData.name === pickedName);
        let pickedNameQuestionnaire = {};
        if (pickedNameData) {
            pickedNameQuestionnaire = pickedNameData.questionnaire;
        }
        this.setState({ pickedNameAnswers: pickedNameQuestionnaire });
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
        console.log(this.state.currentUser);
        
        let cannotDrawThisName = pickedName === this.state.currentUser || twoSidedSanta;
        while (cannotDrawThisName) {
            pickedNumber = Math.floor(Math.random() * this.state.leftNames.length);
            pickedName = this.state.leftNames[pickedNumber];            
            twoSidedSanta = userSecretSanta ? userSecretSanta.pickedName === this.state.currentUser : false;
            cannotDrawThisName = pickedName === this.state.currentUser || twoSidedSanta;
        }
        let obj = { cookie: userCookie, name: this.state.currentUser, pickedName: pickedName, questionnaire: this.state.questionnaire };
        
        newlyDrawn.push(obj);

        const newNames = this.state.leftNames.filter(name => name !== pickedName);
        this.setState({ leftNames: newNames, drawn: newlyDrawn })

        setNames(newNames);
        setDrawn(newlyDrawn);
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
            <h1>Таен Дядо Коледа Правила:</h1>
                <h2>Магическата кутия ще реши на кого да бъдеш Тайният Дядо Коледа. След като изтеглиш име, ще можеш пак да се връщаш, за да гледаш отговорите. Вземи подарък
                    на човека си на стойност до 30 лева. На Нова Година, когато всички се съберем, ще си разменим подаръците.
                </h2>
                <button onClick={this.authenticate.bind(this)}>Напред</button>
            </div>
            <div className="authenticate">
                <label className="Label" for="names">{"Кой си ти?"}</label>
                <select name="names" id="names" onChange={this.changeCurrentUser.bind(this)}>
                    {this.state.allNames.map(name => (
                        <option value={name}>{name}</option>
                    ))}
                </select>
                <input id="password" placeholder="Парола" type="password" onChange={this.changePassword.bind(this)}/>
                <button onClick={this.selectName.bind(this)}>Напред</button>
            </div>
            <div className="questions">
                {Object.values(this.state.questionnaire).map((entry, id) => {
                    return <>
                        <label className="label" for="names">{entry.question}</label>
                        <input id={"gift"+id} placeholder="Твоят отговор (по желание)" onChange={(e) => this.changeAnswer(e, id)}/>
                    </>
                })}
                <button className="small" onClick={this.showBox.bind(this)}>Изтегли име</button>
            </div>
            <header className="App-header">
                {!this.state.showName && <p>Отвори подаръка!</p>}
                <img src={logo} className="jump" onClick={this.giveName.bind(this)} alt="logo" />
                {this.state.showName ? 
                <div className="showNameBox">
                <h2>{"Твоят човек е:"}</h2>
                <h1>{this.state.pickedName}</h1>
                <h2>{"А техните отговори са:"}</h2>
                {Object.keys(this.state.pickedNameAnswers).length === 0 && <p className="comeBack">Още не са теглили име. Върни се по-късно :)</p>}
                {Object.values(this.state.pickedNameAnswers).map(entry => (
                <div className="answers">
                    <h2 className="question">{entry.question}</h2>
                    <h2 className="answer">{entry.answer}</h2>
                </div>
                ))}
                </div>
                 : ""}
            </header>
            </div>
        );
    }
}

export default App;
