module.exports = {
    name: "plan",
    description: "Pokazuje plan na dzisiaj, jutro lub wybrany dzień",
    aliases: ['p'],
    usage: 'plan dzisiaj | jutro | [rok] [miesiąc] [dzień]',
    category: 'vulcan',
    execute(client, message, args) {
        const config = {
            "Token": process.env.TOKEN,
            "prefix": process.env.PREFIX,
            "pathToDatabase": process.env.PATH_TO_DATABASE,
            "password": process.env.PASSWORD,
            "FirebaseTokenKey": process.env.FIRE_BASE_TOKEN_KEY,
            "ownerIDMat": process.env.OWNER_ID_MAT,
            "ownerIDLuk": process.env.OWNER_ID_LUK
        }

        const Keyv = require("keyv")
        const keyv = new Keyv(config.pathToDatabase)
        let jdo


        (async () => {
            let jestWBazie = await keyv.get(message.author.id)
            console.log("jest w bazie: " + (jestWBazie ? "true" : "false") + "\nkto: " + message.author.id)
            if (!jestWBazie) {
                message.channel.send("najpierw musisz się zalogować pisząc bezpośrednio **do mnie** prywatną wiadomość używając komendy: `" + client.config.prefix + "login [token] [symbol] [pin]`")
                return
            }
            jdo = JSON.parse((await keyv.get(message.author.id)).toString())

            if (args.length < 1) args.push("dzisiaj")
            else if ((args[0] !== "dzisiaj" && args[0] !== "jutro") && (isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2]))) {
                message.channel.send("Podano nieprawidłowe dane. Poprawne użycie: `$zsk plan dzisiaj / jutro / [rok] [miesiąc] [dzień]`")
                return
            }

            const uuidv4 = require('uuidv4'),
                signer = require("@wulkanowy/uonet-request-signer-node"),
                request = require("request"),
                uonet = require("../uonet.js"),

                certificateKey1 = jdo.certyfikatKlucz,
                password1 = config.password,
                certificate1 = jdo.certyfikatPfx,
                urlPlan = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/PlanLekcjiZeZmianami`,
                urlSlowniki = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/Slowniki`,
                timekey = Math.floor(Date.now() / 1000),
                timekey1 = timekey - 1,
                idOddzial = jdo.idOddzial,
                idOkresKlasyfikacyjny = jdo.idOkresKlasyfikacyjny,
                idUczen = jdo.idUczen,

                d = new Date(),
                dz = args[0] === "dzisiaj",
                rokWybrany = args[0] === "dzisiaj" || args[0] === "jutro" ? d.getFullYear() : args[0],
                miesiacWybrany = args[0] === "dzisiaj" || args[0] === "jutro" ? d.getMonth() + 1 : args[1],
                dzienWybrany = args[0] === "dzisiaj" ? d.getDate() : args[0] === "jutro" ? d.getDate() + 1 : args[2],
                dtw = new Date().setFullYear(rokWybrany, miesiacWybrany - 1, dzienWybrany),
                dzienTygWybrany = args[0] === "dzisiaj" ? d.getDay() : args[0] === "jutro" ? d.getDay() + 1 > 6 ? 0 : d.getDay() : new Date(dtw).getDay(),
                days = ["Niedziela", "Poniedziałek", "Wtorek", "środa", "Czwartek", "Piątek", "Sobota"],
                dzienNazwa = days[dzienTygWybrany],

                mdd = miesiacWybrany < 10 ? "0" + miesiacWybrany : miesiacWybrany,
                ddd = dzienWybrany < 10 ? "0" + dzienWybrany : dzienWybrany,
                dataWybrana = rokWybrany + "-" + mdd + "-" + ddd,

                dataPoczatkowa = uonet.getDataPoczatkowa(rokWybrany, miesiacWybrany, dzienWybrany, dzienTygWybrany),
                dataKoncowa = uonet.getDataKoncowa(rokWybrany, miesiacWybrany, dzienWybrany, dzienTygWybrany)

            console.log(`DataWybrana: ${dataWybrana}`)
            console.log(`Data początkowa: ${dataPoczatkowa}`)
            console.log(`Data koncowa: ${dataKoncowa}`)

            let formPlan = {
                "DataPoczatkowa": dataPoczatkowa,
                "DataKoncowa": dataKoncowa,
                "IdOddzial": idOddzial,
                "IdOkresKlasyfikacyjny": idOkresKlasyfikacyjny,
                "IdUczen": idUczen,
                "RemoteMobileTimeKey": timekey,
                "TimeKey": timekey1,
                "RequestId": uuidv4.uuid(),
                "RemoteMobileAppVersion": "19.4.1.436",
                "RemoteMobileAppName": "VULCAN-Android-ModulUcznia"
            }
            let formSlowniki = {
                "RemoteMobileTimeKey": timekey,
                "TimeKey": timekey1,
                "RequestId": uuidv4.uuid(),
                "RemoteMobileAppVersion": "19.4.1.436",
                "RemoteMobileAppName": "VULCAN-Android-ModulUcznia"
            }
            let formData = JSON.stringify(formPlan)
            let formData2 = JSON.stringify(formSlowniki)

            signer.signContent(password1, certificate1, formData).then(signed => {
                message.channel.startTyping()
                request({
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'RequestCertificateKey': certificateKey1,
                        'RequestSignatureValue': signed,
                        'User-Agent': 'MobileUserAgent'
                    },
                    url: urlPlan,
                    body: formData,
                    method: 'POST'
                }, function (err, res, body) {
                    if (body.toString() !== "Bad Request") {
                        const json = JSON.parse(body);
                        console.log("Status: " + json.Status);
                        const lekcje = json.Data
                        let nauczyciele, pory
                        const tabwynik = []
                        let lekcja = "", co = "", gdzie = "", zKim = "", godzina = ""

                        lekcje.forEach(function (item) {
                                if (item.DzienTekst === dataWybrana && item.PlanUcznia === true) {
                                    tabwynik.push(item.NumerLekcji + "," + item.Sala + "," + item.PrzedmiotNazwa + "," + item.IdPoraLekcji + "," + item.IdPracownik)
                                }
                            }
                        )

                        signer.signContent(password1, certificate1, formData2).then(signed2 => {
                            request({
                                headers: {
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'RequestCertificateKey': certificateKey1,
                                    'RequestSignatureValue': signed2,
                                    'User-Agent': 'MobileUserAgent'
                                },
                                url: urlSlowniki,
                                body: formData2,
                                method: 'POST'
                            }, function (err, res, body) {
                                let data = JSON.parse(body).Data
                                console.log("Status: " + JSON.parse(body).Status);
                                nauczyciele = data.Nauczyciele
                                pory = data.PoryLekcji

                                if (tabwynik.length > 0) {
                                    tabwynik.sort()
                                    let liNumer = 0, liSala = 0, liPrzedmiot = 0, liNauczyciel = 0
                                    tabwynik.forEach(function (item) {
                                        cale = item.split(",")
                                        if (cale[0].length > liNumer) liNumer = cale[0].length
                                        if (cale[1].length > liSala) liSala = cale[1].length
                                        if (cale[2].length > liPrzedmiot) liPrzedmiot = cale[2].length
                                        if (cale[4].length > liNauczyciel) liNauczyciel = cale[4].length
                                    })
                                    let calusienkie = `PLAN LEKCJI - ${dzienNazwa}\nnr${spacja(liNumer + 1)}sala${spacja(liSala - 1)}godziny${spacja(7)}przedmiot${spacja(liPrzedmiot - 6)}nauczyciel\n`
                                    tabwynik.forEach(function (item) {
                                        cale = item.split(",")
                                        lekcja = cale[0]
                                        gdzie = cale[1]
                                        co = cale[2]
                                        pory.forEach(function (item) {
                                            if (item["Id"].toString() === cale[3]) godzina = item.PoczatekTekst + "-" + item.KoniecTekst
                                        })
                                        nauczyciele.forEach(function (item) {
                                            if (item["Id"].toString() === cale[4]) zKim = item.Imie + " " + item.Nazwisko
                                        })
                                        pel = godzina.split("-")
                                        hour = new Date().getHours()
                                        minut = new Date().getMinutes()
                                        if (
                                            parseInt(pel[0].split(":")[0]) <= hour &&
                                            parseInt(pel[0].split(":")[1]) <= minut &&
                                            parseInt(pel[1].split(":")[0]) >= hour &&
                                            parseInt(pel[1].split(":")[1]) >= minut && dz
                                        ) {
                                            calusienkie += calusienkie += lekcja + ">" + spacja(3 + liNumer - lekcja.length - 1) + gdzie + spacja(3 + liSala - gdzie.length) + godzina + "   " + co + spacja(3 + liPrzedmiot - co.length) + zKim + "\n"
                                        } else calusienkie += lekcja + spacja(3 + liNumer - lekcja.length) + gdzie + spacja(3 + liSala - gdzie.length) + godzina + "   " + co + spacja(3 + liPrzedmiot - co.length) + zKim + "\n"
                                    })
                                    message.channel.send("```" + calusienkie + "```")
                                } else {
                                    message.channel.send("Nie znalazłem żadnej lekcji tego dnia.")
                                }
                            });
                        });
                    } else {
                        console.log("Bad Request")
                        message.channel.send("Coś poszło nie tak. Prawdopodobie wyrejestrowałeś/aś urządzenie na stronie internetowej. Sprawdź czy \"Przyjaciel z ZSK\" nadal widnieje na liście zarejestrowanych urządzeń. Jeżeli nie: zaloguj się ponownie.")
                    }
                });
                message.channel.stopTyping()
            });

            function spacja(ile) {
                let spac = ""
                for (i = 1; i <= ile; i++) {
                    spac += " "
                }
                return spac
            }
        })()
    }
}
