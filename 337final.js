/*
Jake Lockett & Jacom Sommer
CSC 337
4/24/2019
337final.js
 */
"use strict";
(function() {
  /** onload
  gets all the elements we need
  */
  let rolling;
  let roll="NULL";
  window.onload=function() {
    let butt=document.getElementById("butt");
    let d20=document.getElementById("20");
    let d12=document.getElementById("12");
    let d10=document.getElementById("10");
    let d8=document.getElementById("8");
    let d6=document.getElementById("6");
    let d4=document.getElementById("4");
    d20.onclick=function(){rollthedice(20)};
    d12.onclick=function(){rollthedice(12)};
    d10.onclick=function(){rollthedice(10)};
    d8.onclick=function(){rollthedice(8)};
    d6.onclick=function(){rollthedice(6)};
    d4.onclick=function(){rollthedice(4)};
    butt.onclick=maker
  }
  /** maker
  gets all the items from the service
  */
  function maker() {
    let add;
    let body=document.getElementById("main");
    document.getElementById("query").innerHTML="Press the button to make another character";
    body.innerHTML="";
    let url="http://localhost:3000?type=race";
    add=document.createElement("p");
    add.id="class";
    body.appendChild(add);
    fetch(url)
      .then(checkStatus)
      .then(function(responseText) {
        let r = JSON.parse(responseText);
        r=r.split(" ");
        let race=r[0];
        let bonus=r;
        document.getElementById("class").innerHTML=("This character is a: "+race);
        url="http://localhost:3000?type=class"
        fetch(url)
          .then(checkStatus)
          .then(function(responseText) {
            let hold=document.getElementById("class").innerHTML;
            let r = JSON.parse(responseText);
            r=r.split(" ");
            let cls=r[0];
            document.getElementById("class").innerHTML=hold+" "+cls;
            let rolls=statter(bonus,r);
            let stats=document.createElement("p");
            stats.innerHTML="Strength: "+rolls[0]+"<br />";
            stats.innerHTML=stats.innerHTML+"Dexterity: "+rolls[1]+"<br />";
            stats.innerHTML=stats.innerHTML+"Constitution: "+rolls[2]+"<br />";
            stats.innerHTML=stats.innerHTML+"Intelligence: "+rolls[4]+"<br />";
            stats.innerHTML=stats.innerHTML+"Wisdom: "+rolls[3]+"<br />";
            stats.innerHTML=stats.innerHTML+"Charisma: "+rolls[5]+"<br />";
            url="http://localhost:3000?type=background"
            fetch(url)
              .then(checkStatus)
              .then(function(responseText) {
                r = JSON.parse(responseText);
                let back=document.createElement("p");
                back.innerHTML=("Their background is: "+r);
                let add=document.createElement("p");
                add.innerHTML="Their stats are: ";
                body.appendChild(back);
                body.appendChild(add);
                body.appendChild(stats);
            });
        });
    });
    /**
    add=document.createElement("p");
    add.innerHTML=("Their background is: ");
    body.appendChild(add);
    add=document.createElement("p");
    add.innerHTML=("Their bond is: ");
    body.appendChild(add);
    add=document.createElement("p");
    add.innerHTML=("Their ideal is: ");
    body.appendChild(add);
    add=document.createElement("p");
    add.innerHTML=("Their flaw is: ");
    body.appendChild(add);
    */
  }
  /** statter
  Uses the responsetext and returns a list of stats in desired order
  */
  function statter(bonus,r) {
    let stat1=r[1];
    let stat2=r[2];
    let stat3=r[3];
    let add=document.createElement("p");
    let stats={};
    let ability=["str","dex","con","wis","int","cha"];
    let weak=[];
    let c;
    for (let i=0; i<ability.length; i++) {
      c=ability[i];
      if (c!=stat1) {
        if (c!=stat2) {
          if (c!=stat3) {
            weak.push(c);
          }
        }
      }
    }
    let weaks=order();
    stats["str"]=0;
    stats["dex"]=0;
    stats["con"]=0;
    stats["int"]=0;
    stats["wis"]=0;
    stats["cha"]=0;
    let b;
    let rolls=randRoll();
    for (let i=1; i<bonus.length; i++) {
      b=bonus[i].split("+");
      stats[b[0]]=stats[b[0]]+parseInt(b[1],10);
    }
    /**
    console.log(stats[stat1]+rolls[0]);
    statList.push(stats[stat1]+rolls[0]);
    statList.push(stats[stat2]+rolls[1]);
    statList.push(stats[stat3]+rolls[2]);
    statList.push(stats[weak[weaks[0]]]+rolls[3]);
    statList.push(stats[weak[weaks[1]]]+rolls[4]);
    statList.push(stats[weak[weaks[2]]]+rolls[5]);
    console.log(statList);
    */
    stats[stat1]=stats[stat1]+rolls[0];
    stats[stat2]=stats[stat2]+rolls[1];
    stats[stat3]=stats[stat3]+rolls[2];
    stats[weak[weaks[0]]]=stats[weak[weaks[0]]]+rolls[3];
    stats[weak[weaks[1]]]=stats[weak[weaks[1]]]+rolls[4];
    stats[weak[weaks[2]]]=stats[weak[weaks[2]]]+rolls[5];
    let statList=[stats["str"],stats["dex"],stats["con"],stats["wis"],stats["int"],stats["cha"]];
    return statList
  }
  /** randomIntInterval
  Inclusively returns a number between min and max
  */
  function randomIntInterval(min, max) {
    return Math.floor(Math.random() * (max-min + 1) + min);
  }
  /** randRoll
  returns the 6 highest stat rolls
  */
  function randRoll() {
    let stats=[];
    for (let i=0; i<7; i++) {
      stats.push(rollStat());
    }
    stats.sort(function(x,y) {
      return y-x
    });
    stats.pop();
    return stats
  }
  /** rollStat
  returns the 3 highest d6 rolls of 4
  */
  function rollStat() {
    let stat=[];
    for (let i=0; i<4; i++) {
      stat.push(randomIntInterval(1, 6));
    }
    stat.sort(function(x,y) {
      return x-y
    });
    return stat[1]+stat[2]+stat[3];
  }
  /**
  checkStatus
  function taken from the slides to check for errors
  */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status+":"+response.statusText));
    }
  }
  /** rollthedice
makes that fun dice rolling image
  */
  function rollthedice(dice) {
    if (roll=="NULL") {
      rolling=setInterval(tick,50,dice);
      setTimeout(function () {
        clearInterval(rolling);
        roll="NULL";
      }, 500);
    }
  }
  /** tick
  shows a random value on the die roll
  */
  function tick(dice) {
    document.getElementById("roll").innerHTML=randomIntInterval(1,dice);
  }
  /** order
  returns the weaker stats in a random order
  */
  function order() {
    let track=["False","False","False"];
    let nums=[];
    let num;
    while (track[0]=="False" || track[1]=="False" || track[2]=="False") {
      num=randomIntInterval(0, 2);
      if (track[num]=="False") {
        track[num]="True";
        nums.push(num);
      }
    }
    return nums
  }
}) ();
