module.exports = {
    name: "oceny",
    description: "Pokazuje najnowsze oceny ucznia lub oceny z podanego przedmiotu",
    aliases: ['o', 'ocenki', 'oc'],
    usage: 'oceny wszystkie | [pełna nazwa przedmiotu]',
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

            let przedmiotWybrany = "";
            if (args.length > 0) {
                args.forEach(function (item) {
                    przedmiotWybrany += item + " "
                })
                przedmiotWybrany = przedmiotWybrany.slice(0, -1)
            } else {
                przedmiotWybrany = "wszystkie"
            }
            przedmiotWybrany = przedmiotWybrany.toLowerCase()

            const uuidv4 = require('uuidv4'),
                signer = require("@wulkanowy/uonet-request-signer-node"),
                request = require("request"),

                certificateKey1 = jdo.certyfikatKlucz,
                password1 = config.password,
                certificate1 = jdo.certyfikatPfx,
                urlOceny = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/Oceny`,
                urlSlowniki = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/Slowniki`,
                timekey = Math.floor(Date.now() / 1000),
                timekey1 = timekey - 1,
                idOkresKlasyfikacyjny = jdo.idOkresKlasyfikacyjny,
                idUczen = jdo.idUczen

            let formOceny = {
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
            let formData = JSON.stringify(formOceny)
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
                    url: urlOceny,
                    body: formData,
                    method: 'POST'
                }, function (err, res, body) {
                    if (body.toString() !== "Bad Request") {
                        const json = JSON.parse(body);
                        console.log("Status: " + json.Status);
                        const ocenyJson = json.Data
                        let nauczyciele, przedmioty
                        const ocenyLista = []
                        let opis, ocena, waga, dataTekst, przedmiot, nauczyciel

                        ocenyJson.forEach(function (item) {
                                ocenyLista.push(item["DataUtworzeniaTekst"] + ",,," + item["Wpis"] + ",,," + item["Waga"] + ",,," + item["Opis"] + ",,," + item["IdPrzedmiot"] + ",,," + item["IdPracownikD"])
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
                                nauczyciele = data["Nauczyciele"]
                                przedmioty = data["Przedmioty"]

                                if (ocenyLista.length > 0) {
                                    ocenyLista.sort()
                                    ocenyLista.reverse()
                                    let tabOceny = [] //Tablica z stringami ["Matematyka: 5, 5-, 3+","Przyroda: 3, 1, 2+"]
                                    if (przedmiotWybrany === "wszystkie") {
                                        przedmioty.forEach(function (przedmiot) {
                                            let sameOcenyTab = []
                                            ocenyLista.forEach(function (ocena) {
                                                let cale = ocena.split(",,,")
                                                if (przedmiot["Id"].toString() === cale[4]) {
                                                    sameOcenyTab.push(cale[1])
                                                }
                                            })
                                            if (sameOcenyTab.length > 0) {
                                                let stringDoPush = przedmiot["Nazwa"] + ": " + sameOcenyTab.join(", ")
                                                tabOceny.push(stringDoPush)
                                            }
                                        })
                                        if (tabOceny.length > 0) {
                                            message.channel.send("```OCENY\n" + tabOceny.join("\n") + "\n\nJeżeli chcesz zobaczyć szczegóły wpisz: " + client.config.prefix + "oceny [przedmiot]```")
                                        } else message.channel.send("Nie znalazłem ocen z żadnego przedmiotu")
                                    } else {
                                        let liData = 0, liOcena = 0, liWaga = 0, liOpis = 0, liPrzedmiot = 0
                                        ocenyLista.forEach(function (item) {
                                            let cale = item.split(",,,")
                                            przedmioty.forEach(function (item) {
                                                if (item["Id"].toString() === cale[4] && (item["Nazwa"].toString().toLowerCase() === przedmiotWybrany || przedmiotWybrany === "wszystkie")) {
                                                    let nazwa = item["Nazwa"]
                                                    if (nazwa.length > liPrzedmiot) liPrzedmiot = nazwa.length
                                                    if (cale[0].length > liData) liData = cale[0].length
                                                    if (cale[1].length > liOcena) liOcena = cale[1].length
                                                    if (cale[2].length > liWaga) liWaga = cale[2].length
                                                    if (cale[3].length > liOpis) liOpis = cale[3].length
                                                }
                                            })
                                        })
                                        let calusienkie = `\nOCENY\ndata${spacja(liData - 1)}wpis${spacja(liOcena - 1)}waga${spacja(liWaga - 1)}opis${spacja(liOpis - 1)}przedmiot${spacja(liPrzedmiot - 6)}nauczyciel\n`
                                        ocenyLista.forEach(function (item) {
                                            let cale = item.split(",,,")
                                            dataTekst = cale[0]
                                            ocena = cale[1]
                                            waga = cale[2]
                                            opis = cale[3]
                                            if (opis.length === 0) opis = "(Brak opisu)"
                                            przedmioty.forEach(function (item) {
                                                if (item["Id"].toString() === cale[4]) przedmiot = item["Nazwa"]
                                            })
                                            nauczyciele.forEach(function (item) {
                                                if (item["Id"].toString() === cale[5]) nauczyciel = item["Imie"] + " " + item["Nazwisko"]
                                            })
                                            if (przedmiot.toString().toLowerCase() === przedmiotWybrany) {
                                                let calTest = calusienkie + dataTekst + spacja(3 + liData - dataTekst.length) + ocena + spacja(3 + liOcena - ocena.length) + waga + spacja(3 + liWaga - waga.length) + opis + spacja(3 + liOpis - opis.length) + przedmiot + spacja(3 + liPrzedmiot - przedmiot.length) + nauczyciel + "\n"
                                                if (calTest.length < 2000)
                                                    calusienkie += dataTekst + spacja(3 + liData - dataTekst.length) + ocena + spacja(3 + liOcena - ocena.length) + waga + spacja(3 + liWaga - waga.length) + opis + spacja(3 + liOpis - opis.length) + przedmiot + spacja(3 + liPrzedmiot - przedmiot.length) + nauczyciel + "\n"
                                            }
                                        })
                                        message.channel.send("```" + calusienkie + "```")
                                    }
                                } else {
                                    message.channel.send("Nie znalazłem żadnych ocen")
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
                let spacyjka = ""
                for (let i = 1; i <= ile; i++) {
                    spacyjka += " "
                }
                return spacyjka
            }
        })()
    }
}
