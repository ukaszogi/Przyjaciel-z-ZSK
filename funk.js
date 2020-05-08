const databass = require("./data.json");
fs = require("fs");

class Event {
    constructor(data, przedmiot, temat) {
        this.data = data;
        this.przedmiot = przedmiot;
        this.temat = temat;
    }
}

//funkcje Blisko
{
    exports.sprBlisko = function (gr, n) {
        w = [];
        gr -= 1;
        for (i = 0, j = 0; i < databass.spr[gr].length && j < n; i++) {
            if (databass.spr[gr][i].data > d) {
                w.push(databass.spr[gr][i]);
                j++;
            }
        }
        for (i = 0; i < (w.length); i = i + 1) {
            w[i] = (konwersjaEventu(w[i]));
        }
        return (w);
    }

    exports.krtBlisko = function (gr, n) {
        w = [];
        gr -= 1;
        for (i = 0, j = 0; i < databass.krt[gr].length && j < n; i++) {
            if (databass.krt[gr][i].data > d) {
                w.push(databass.krt[gr][i]);
                j++;
            }
        }
        for (i = 0; i < (w.length); i = i + 1) {
            w[i] = (konwersjaEventu(w[i]));
        }
        return (w);
    }

    exports.zadBlisko = function (gr, n) {
        w = [];
        gr -= 1;
        for (i = 0, j = 0; i < databass.zad[gr].length && j < n; i++) {
            if (databass.zad[gr][i].data > d) {
                w.push(databass.zad[gr][i]);
                j++;
            }
        }
        for (i = 0; i < (w.length); i = i + 1) {
            w[i] = (konwersjaEventu(w[i]));
        }
        return (w);
    }
}

//funkcje Nowy
{
    exports.sprNowy = function (gr, dane) {
        gr -= 1;
        dane = nowyEvent(dane[0], dane[1], dane[2])
        databass.spr[gr].push(dane);
        fs.writeFile("./data.json", JSON.stringify(databass), (err) => {
            if (err) console.error(err)
        });
    }

    exports.krtNowy = function (gr, dane) {
        gr -= 1;
        dane = nowyEvent(dane[0], dane[1], dane[2])
        databass.krt[gr].push(dane);
        fs.writeFile("./data.json", JSON.stringify(databass), (err) => {
            if (err) console.error(err)
        });
    }

    exports.zadNowy = function (gr, dane) {
        gr -= 1;
        dane = nowyEvent(dane[0], dane[1], dane[2])
        databass.zad[gr].push(dane);
        fs.writeFile("./data.json", JSON.stringify(databass), (err) => {
            if (err) console.error(err)
        });
    }

    function nowyEvent(data, przedmiot, temat) {
        return (new Event(data, przedmiot, temat));
    }
}

//funkcje Stary
{
    exports.sprStary = function (gr, msg) {
        gr -= 1;
        var l = 0;
        for (i = 0; i < databass.spr[gr].length; i++) {
            if (databass.spr[gr][i].data < d) {
                databass.spr[gr].splice(i, 1);
                l++;
                i--;
            }
        }
        fs.writeFile("./data.json", JSON.stringify(databass), (err) => {
            if (err) console.error(err)
        });
        l = l.toString()
        if (l == "1") msg.channel.send("Usunięto " + l + " wydarzenie");
        else if (l == "3" || l == "2" || l == "4") msg.channel.send("Usunięto " + l + " wydarzenia");
        else msg.channel.send("Usunięto " + l + " wydarzeń");
    }

    exports.krtStary = function (gr, msg) {
        gr -= 1;
        var l = 0;
        for (i = 0; i < databass.krt[gr].length; i++) {
            if (databass.krt[gr][i].data < d) {
                databass.krt[gr].splice(i, 1);
                l++;
                i--;
            }
        }
        fs.writeFile("./data.json", JSON.stringify(databass), (err) => {
            if (err) console.error(err)
        });
        l = l.toString()
        if (l == "1") msg.channel.send("Usunięto " + l + " wydarzenie");
        else if (l == "3" || l == "2" || l == "4") msg.channel.send("Usunięto " + l + " wydarzenia");
        else msg.channel.send("Usunięto " + l + " wydarzeń");
    }

    exports.zadStary = function (gr, msg) {
        gr -= 1;
        var l = 0;
        for (i = 0; i < databass.zad[gr].length; i++) {
            if (databass.zad[gr][i].data < d) {
                databass.zad[gr].splice(i, 1);
                l++;
                i--;
            }
        }
        fs.writeFile("./data.json", JSON.stringify(databass), (err) => {
            if (err) console.error(err)
        });
        l = l.toString()
        if (l == "1") msg.channel.send("Usunięto " + l + " wydarzenie");
        else if (l == "3" || l == "2" || l == "4") msg.channel.send("Usunięto " + l + " wydarzenia");
        else msg.channel.send("Usunięto " + l + " wydarzeń");
    }
}

//Funkcje konwersji
{
    function konwersjaDaty(dary) {
        if (dary[8] == "0")
            return (dary[6] + dary[7] + " " + dary[4] + dary[5] + " " + dary[0] + dary[1] + dary[2] + dary[3] + ", cały dzień");
        else
            return (dary[6] + dary[7] + " " + dary[4] + dary[5] + " " + dary[0] + dary[1] + dary[2] + dary[3] + ", lekcja " + dary[8]);
    }

    function konwersjaEventu(e) {
        return (konwersjaDaty(e.data) + ": \t" + e.przedmiot + " - " + e.temat);
    }
}


//Funkcje Sedner
{

    exports.sprSend = function (gr, n, msg) {
        w = exports.sprBlisko(gr, n);
        for (i = 0; i < w.length; i++) {
            msg.channel.send(w[i])
        }
    }
    exports.krtSend = function (gr, n, msg) {
        w = exports.krtBlisko(gr, n);
        for (i = 0; i < w.length; i++) {
            msg.channel.send(w[i])
        }
    }
    exports.zadSend = function (gr, n, msg) {
        w = exports.zadBlisko(gr, n);
        for (i = 0; i < w.length; i++) {
            msg.channel.send(w[i])
        }
    }


    var D = new Date();
    var d = D.getFullYear() * 100000 + (D.getMonth() + 1) * 1000 + D.getDate() * 10;
//console.log(databass.spr[0]);
//sprBlisko(1,4);

//const majma =  nowyEvent("202012116", "WF", "PingPong backhand");
//console.log(majma)
//sprNowy(1,majma)

//sprBlisko(1,4);

//sprStary(1)
//console.log(databass.spr[0]);
//console.log(konwersjaDaty(databass.spr[0][0].data));

//console.log(sprBlisko(1,3));
}
