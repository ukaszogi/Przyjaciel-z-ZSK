class Event {
    constructor(data,przedmiot,temat) {
        this.data = data;
        this.przedmiot = przedmiot;
        this.temat = temat;
    }
}

//funkcje Blisko
{
function sprBlisko(gr, n) {
    w = []
    gr-=1;
    for (i=0, j=0;i<databass.spr[gr].length&&j<n;i++) {
        if (databass.spr[gr][i].data>d) {
            w.push(databass.spr[gr][i]);
            j++;
        }
    }
    return(w);
}

function krtBlisko(gr, n) {
    w = []
    gr-=1;
    for (i=0, j=0;i<databass.krt[gr].length&&j<n;i++) {
        if (databass.krt[gr][i].data>d) {
            w.push(databass.krt[gr][i]);
            j++;
        }
    }
    return(w);
}

function zadBlisko(gr, n) {
    w = []
    gr-=1;
    for (i=0, j=0;i<databass.zad[gr].length&&j<n;i++) {
        if (databass.zad[gr][i].data>d) {
            w.push(databass.zad[gr][i]);
            j++;
        }
    }
    return(w);
}
}

//funkcje Nowy
{
function sprNowy(gr, dane) {
    gr-=1;
    databass.spr[gr].push(dane);
}

function krtNowy(gr, dane) {
    gr-=1;
    databass.krt[gr].push(dane);
}

function zadNowy(gr, dane) {
    gr-=1;
    databass.zad[gr].push(dane);
}

function nowyEvent(data,przedmiot,temat) {
    return(new Event(data, przedmiot, temat));
}
}

//funkcje Stary
{
function sprStary(gr) {
    gr -=1;
    for (i=0; databass.spr[gr][i].data < d;i++) {
        databass.spr[gr].shift();
    }
}

function krtStary(gr) {
    gr -=1;
    for (i=0; databass.krt[gr][i].data < d;i++) {
        databass.krt[gr].shift();
    }
}

function zadStary(gr) {
    gr -=1;
    for (i=0; databass.zad[gr][i].data < d;i++) {
        databass.zad[gr].shift();
    }
}
}


function konwersjaDaty(dary) {
    return(dary[6]+dary[7]+" "+dary[4]+dary[5]+" "+dary[0]+dary[1]+dary[2]+dary[3]+", lekcja "+dary[8]);
}

function konwersjaEventu(e) {
    return(konwersjaDaty(e.data)+": "+e.przedmiot+" - "+e.temat);
}



const databass = require("./newdata.json");
var D = new Date();
var d = D.getFullYear()*100000 + (D.getMonth()+1)*1000 + D.getDate()*10;
d = 201912030
//console.log(databass.spr[0]);
//sprBlisko(1,4);

const majma =  nowyEvent("202012116", "WF", "PingPong backhand");
//console.log(majma)
sprNowy(1,majma)
//sprBlisko(1,4);
//console.log(databass.spr[0],"\n");
//console.log(databass.spr[0][4].data)
//sprStary(1)
//console.log(databass.spr[0]);
//console.log(konwersjaDaty(databass.spr[0][0].data));
//console.log(sprBlisko(1,3)+"\n\n");
w=sprBlisko(1,3);
for(i=0 ; i < (w.length) ; i=i+1) {
    console.log(konwersjaEventu(w[i]));
}
