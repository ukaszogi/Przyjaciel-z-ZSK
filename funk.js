class Event {
    constructor(data,przedmiot,temat) {
        this.data = data;
        this.przedmiot = przedmiot;
        this.temat = temat;
    }
}

function sprBlisko(gr, n) {
    gr-=1;
    for (i=0, j=0;i<databass.spr[gr].length&&j<n;i++) {
        if (databass.spr[gr][i].data>d) {
            console.log(i);
            console.log(databass.spr[gr][i]);
            j++;
        }
    }
}

function krtBlisko(gr, n) {
    gr-=1;
    for (i=0, j=0;i<databass.krt[gr].length&&j<n;i++) {
        if (databass.krt[gr][i].data>d) {
            console.log(i);
            console.log(databass.krt[gr][i]);
            j++;
        }
    }
}

function zadBlisko(gr, n) {
    gr-=1;
    for (i=0, j=0;i<databass.zad[gr].length&&j<n;i++) {
        if (databass.zad[gr][i].data>d) {
            console.log(i);
            console.log(databass.zad[gr][i]);
            j++;
        }
    }
}

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

const databass = require("./newdata.json");
var D = new Date();
var d = D.getFullYear()*100000 + (D.getMonth()+1)*1000 + D.getDate()*10;
d = 201912030
//console.log(databass.spr[0]);
//sprBlisko(1,4);

const majma = new Event("202012116", "WF", "PingPong backhand");
//console.log(majma)
sprNowy(1,majma)
//sprBlisko(1,4);
console.log(databass.spr[0],"\n");
//console.log(databass.spr[0][4].data)
sprStary(1)
console.log(databass.spr[0]);
