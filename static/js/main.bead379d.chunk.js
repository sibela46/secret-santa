(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,a,t){e.exports=t.p+"static/media/white_christmas.cc877a19.mp3"},14:function(e,a,t){e.exports=t(32)},19:function(e,a,t){},21:function(e,a,t){},32:function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),o=t(5),i=t.n(o),s=(t(19),t(6)),r=t(7),c=t(12),m=t(8),u=t(13),h=t(9),d=t.n(h),p=(t(21),t(10)),y=t.n(p),f=t(4),g=t.n(f),v=t(2),E=t.n(v),w=function(e){function a(e){var t;return Object(s.a)(this,a),(t=Object(c.a)(this,Object(m.a)(a).call(this,e))).state={showName:!1,names:["Callum","Jack","Elias","Katie","Palvi","Myles","James","Sisi"],cookieNames:E.a.loadAll(),pickedNumber:-1,allNumers:[]},t}return Object(u.a)(a,e),Object(r.a)(a,[{key:"componentWillMount",value:function(){}},{key:"contains",value:function(e){var a=e!==e;return(a||"function"!==typeof Array.prototype.indexOf?function(e){var t=-1,n=-1;for(t=0;t<this.length;t++){var l=this[t];if(a&&l!==l||l===e){n=t;break}}return n}:Array.prototype.indexOf).call(this,e)>-1}},{key:"showBox",value:function(){for(var e=0;e<this.state.names.length;e++)this.setState({cookieNames:E.a.load("name"+e)});document.getElementsByClassName("rules")[0].style.display="none",document.getElementsByClassName("jump")[0].style.display="block"}},{key:"giveName",value:function(e){this.setState({showName:!0}),document.getElementsByClassName("jump")[0].style.display="none";for(var a=Math.floor(8*Math.random()),t=E.a.load("name"+a),n=[];void 0===t;){if(a=Math.floor(8*Math.random()),this.contains.call(n,a)||n.push(a),8==n.length){t="No names left";break}t=E.a.load("name"+a)}this.setState({pickedName:t}),E.a.remove("name"+a,{path:"/"})}},{key:"render",value:function(){return l.a.createElement("div",{className:"App"},l.a.createElement("div",{className:"rules"},l.a.createElement("h1",null,"Secret Santa Rules:"),l.a.createElement("h2",null,l.a.createElement("span",null,"1.")," Draw a name from the magic box"),l.a.createElement("h2",null,l.a.createElement("span",null,"2.")," You will then be a Secret Santa to that person..."),l.a.createElement("h2",null,l.a.createElement("span",null,"3.")," Which means you will have to buy them a cute little gift (no more than ",l.a.createElement("span",null,"\xa310")," worth)"),l.a.createElement("h2",null,l.a.createElement("span",null,"4.")," Are you ready to draw a name?"),l.a.createElement("button",{onClick:this.showBox.bind(this)},"Click me")),l.a.createElement("header",{className:"App-header"},l.a.createElement("img",{src:d.a,className:"jump",onClick:this.giveName.bind(this),alt:"logo"}),this.state.showName?l.a.createElement("h1",null,this.state.pickedName):""),l.a.createElement(g.a,{url:y.a,playStatus:g.a.status.PLAYING,playFromPosition:300,onLoading:this.handleSongLoading,onPlaying:this.handleSongPlaying,onFinishedPlaying:this.handleSongFinishedPlaying}))}}]),a}(n.Component),k=t(11);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(k.a,null,l.a.createElement(w,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},9:function(e,a,t){e.exports=t.p+"static/media/green-present.5b5dda5e.svg"}},[[14,2,1]]]);
//# sourceMappingURL=main.bead379d.chunk.js.map