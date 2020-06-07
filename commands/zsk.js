module.exports = {
    name: "zsk",
    description: "",
    aliases: ['zsk'],
    usage: '$zsk spr (up) [grupa] [nie pamiętam xD]',
    execute(client, message, args) {
        const funk = require("./../funk.js");

        if (args[0] === "spr") {
            if (args[1] === "up") {
                let warto = []
                switch (args[2]) {
                    case "1":
                        warto = [args[3], args[4], message.content.replace("$zsk spr up 1 " + args[3] + " " + args[4] + " ", '')];
                        message.channel.send(warto[0]);
                        message.channel.send(warto[1]);
                        message.channel.send(warto[2]);
                        funk.sprNowy(1, warto)
                        break;
                    case "2":
                        warto = [args[3], args[4], message.content.replace("$zsk spr up 2 " + args[3] + " " + args[4] + " ", '')];
                        message.channel.send(warto[0]);
                        message.channel.send(warto[1]);
                        message.channel.send(warto[2]);
                        funk.sprNowy(2, warto)
                        break;
                    case "0":
                        warto = [args[3], args[4], message.content.replace("$zsk spr up 0 " + args[3] + " " + args[4] + " ", '')];
                        message.channel.send(warto[0]);
                        message.channel.send(warto[1]);
                        message.channel.send(warto[2]);
                        funk.sprNowy(1, warto)
                        funk.sprNowy(2, warto)
                        break;
                    default:
                        message.channel.send("Błędna grupa");
                }
            } else if (args[1] === "del") {
                switch (args[2]) {
                    case "1":
                        funk.sprStary(1, message);
                        break;
                    case "2":
                        funk.sprStary(2, message);
                        break;
                    default:
                        if (args.length === 2) {
                            funk.sprStary(1, message);
                            funk.sprStary(2, message);
                        } else message.channel.send("Błędna grupa");
                }
            } else if (args[1] === "1") {
                if (funk.sprBlisko(1, 1).length === 0) message.channel.send("Brak sprawdzianów")
                else if (args[2] === 0 || args.length === 2) funk.sprSend(1, 1000000, message);
                else funk.sprSend(1, parseInt(args[2]), message);
            } else if (args[1] === "2") {
                if (funk.sprBlisko(2, 1).length === 0) message.channel.send("Brak sprawdzianów")
                else if (args[2] === 0 || args.length === 2) funk.sprSend(2, 1000000, message);
                else funk.sprSend(2, parseInt(args[2]), message);
            } else message.channel.send("Błędna grupa/komenda");
        } else if (args[0] === "krt") {
            if (args[1] === "up") {
                let warto = []
                switch (args[2]) {
                    case "1":
                        warto = [args[3], args[4], message.content.replace("$zsk krt up 1 " + args[3] + " " + args[4] + " ", '')];
                        message.channel.send(warto[0]);
                        message.channel.send(warto[1]);
                        message.channel.send(warto[2]);
                        funk.krtNowy(1, warto)
                        break;
                    case "2":
                        warto = [args[3], args[4], message.content.replace("$zsk krt up 2 " + args[3] + " " + args[4] + " ", '')];
                        message.channel.send(warto[0]);
                        message.channel.send(warto[1]);
                        message.channel.send(warto[2]);
                        funk.krtNowy(2, warto)
                        break;
                    default:
                        message.channel.send("Błędna grupa");
                }
            } else if (args[1] === "del") {
                switch (args[2]) {
                    case "1":
                        funk.krtStary(1, message);
                        break;
                    case "2":
                        funk.krtStary(2, message);
                        break;
                    default:
                        if (args.length === 2) {
                            funk.krtStary(1, message);
                            funk.krtStary(2, message);
                        } else message.channel.send("Błędna grupa");
                }
            } else if (args[1] === "1") {
                if (funk.krtBlisko(1, 1).length === 0) message.channel.send("Brak kartkówek")
                else if (args[2] === 0 || args.length === 2) funk.krtSend(1, 1000000, message);
                funk.krtSend(1, parseInt(args[2]), message);
            } else if (args[1] === "2") {
                if (funk.krtBlisko(2, 1).length === 0) message.channel.send("Brak kartkówek")
                else if (args[2] === 0 || args.length === 2) funk.krtSend(2, 1000000, message);
                funk.krtSend(2, parseInt(args[2]), message);
            } else message.channel.send("Błędna grupa/komenda");
        } else if (args[0] === "zad") {
            if (args[1] === "up") {
                let warto = []
                switch (args[2]) {
                    case "1":
                        warto = [args[3], args[4], message.content.replace("$zsk zad up 1 " + args[3] + " " + args[4] + " ", '')];
                        message.channel.send(warto[0]);
                        message.channel.send(warto[1]);
                        message.channel.send(warto[2]);
                        funk.zadNowy(1, warto)
                        break;
                    case "2":
                        warto = [args[3], args[4], message.content.replace("$zsk zad up 2 " + args[3] + " " + args[4] + " ", '')];
                        message.channel.send(warto[0]);
                        message.channel.send(warto[1]);
                        message.channel.send(warto[2]);
                        funk.zadNowy(2, warto)
                        break;
                    default:
                        message.channel.send("Błędna grupa");
                }
            } else if (args[1] === "del") {
                switch (args[2]) {
                    case "1":
                        funk.zadStary(1, message);
                        break;
                    case "2":
                        funk.zadStary(2, message);
                        break;
                    default:
                        if (args.length === 2) {
                            funk.zadStary(1, message);
                            funk.zadStary(2, message);
                        } else message.channel.send("Błędna grupa");
                }
            } else if (args[1] === "1") {
                if (funk.zadBlisko(1, 1).length === 0) message.channel.send("Brak zadań domowych")
                else if (args[2] === 0 || args.length === 2) funk.zadSend(1, 1000000, message);
                funk.zadSend(1, parseInt(args[2]), message);
            } else if (args[1] === "2") {
                if (funk.zadBlisko(1, 1).length === 0) message.channel.send("Brak zadań domowych")
                else if (args[2] === 0 || args.length === 2) funk.zadSend(2, 1000000, message);
                funk.zadSend(2, parseInt(args[2]), message);
            } else message.channel.send("Błędna grupa/komenda");
        } else if (args[0] === "wsz") {
            if (args[1] === "del") {
                switch (args[2]) {
                    case "1":
                        funk.sprStary(1, message);
                        funk.krtStary(1, message);
                        funk.zadStary(1, message);
                        break;
                    case "2":
                        funk.sprStary(2, message);
                        funk.krtStary(2, message);
                        funk.zadStary(2, message);
                        break;
                    default:
                        if (args.length === 2) {
                            funk.sprStary(1, message);
                            funk.krtStary(1, message);
                            funk.zadStary(1, message);
                            funk.sprStary(2, message);
                            funk.krtStary(2, message);
                            funk.zadStary(2, message);
                        } else message.channel.send("Błędna grupa");
                }
            } else if (args[1] === "1") {
                if (funk.sprBlisko(1, 1).length === 0) message.channel.send("Brak sprawdzianów")
                else if (args[2] === 0 || args.length === 2) funk.sprSend(1, 1000000, message);
                else funk.sprSend(1, parseInt(args[2]), message);

                if (funk.krtBlisko(1, 1).length === 0) message.channel.send("Brak kartkówek")
                else if (args[2] === 0 || args.length === 2) funk.krtSend(1, 1000000, message);
                funk.krtSend(1, parseInt(args[2]), message);

                if (funk.zadBlisko(1, 1).length === 0) message.channel.send("Brak zadań domowych")
                else if (args[2] === 0 || args.length === 2) funk.zadSend(1, 1000000, message);
                funk.zadSend(1, parseInt(args[2]), message);
            } else if (args[1] === "2") {
                message.channel.send("Sprawdziany")
                if (funk.sprBlisko(2, 1).length === 0) message.channel.send("Brak sprawdzianów")
                else if (args[2] === 0 || args.length === 2) funk.sprSend(2, 1000000, message);
                else funk.sprSend(2, parseInt(args[2]), message);

                message.channel.send("Kartkówki")
                if (funk.krtBlisko(2, 1).length === 0) message.channel.send("Brak kartkówek")
                else if (args[2] === 0 || args.length === 2) funk.krtSend(2, 1000000, message);
                funk.krtSend(2, parseInt(args[2]), message);

                message.channel.send("Zadania domowe")
                if (funk.zadBlisko(2, 1).length === 0) message.channel.send("Brak zadań domowych")
                else if (args[2] === 0 || args.length === 2) funk.zadSend(2, 1000000, message);
                funk.zadSend(2, parseInt(args[2]), message);
                message.channel.send(["zadania", "domowe", "test", "tablicy"].toString())
            } else if (args.length === 1) {
                message.channel.send("gr 1.")
                message.channel.send("Sprawdziany")
                if (funk.sprBlisko(1, 1).length === 0) message.channel.send("Brak sprawdzianów")
                else funk.sprSend(1, 1000000, message);
                message.channel.send("Kartkówki")
                if (funk.krtBlisko(1, 1).length === 0) message.channel.send("Brak kartkówek")
                else funk.krtSend(1, 1000000, message);
                message.channel.send("Zadania domowe")
                if (funk.zadBlisko(1, 1).length === 0) message.channel.send("Brak zadań domowych")
                else funk.zadSend(1, 1000000, message);
                message.channel.send("gr 2.")
                message.channel.send("Sprawdziany")
                if (funk.sprBlisko(2, 1).length === 0) message.channel.send("Brak sprawdzianów")
                else funk.sprSend(2, 1000000, message);
                message.channel.send("Kartkówki")
                if (funk.krtBlisko(2, 1).length === 0) message.channel.send("Brak kartkówek")
                else funk.krtSend(2, 1000000, message);
                message.channel.send("Zadania domowe")
                if (funk.zadBlisko(2, 1).length === 0) message.channel.send("Brak zadań domowych")
                else funk.zadSend(2, 1000000, message);
            }
        }
    }
}
