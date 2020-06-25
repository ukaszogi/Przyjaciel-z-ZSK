module.exports = {
    name: "podsumowanie",
    description: "Pokazuje proponowane, końcowe i średnie oceny z wszystkich przedmiotów",
    aliases: ['prop', 'kon', 'koncowe', 'srednie', 'sr', 'średnie', 'końcowe', 'koń', 'ko', 'sr', 'śr', 'pr', 'podsumowanie', 'pod', 'po'],
    usage: 'podsumowanie',
    category: 'vulcan',
    execute(client, message/*, args*/) {
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

            const uuidv4 = require('uuidv4'),
                signer = require("@wulkanowy/uonet-request-signer-node"),
                request = require("request"),

                certificateKey1 = jdo.certyfikatKlucz,
                password1 = config.password,
                certificate1 = jdo.certyfikatPfx,
                urlOceny = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/OcenyPodsumowanie`,
                urlSlowniki = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/Slowniki`,
                timekey = Math.floor(Date.now() / 1000),
                timekey1 = timekey - 1,
                idOkresKlasyfikacyjny = jdo.idOkresKlasyfikacyjny,
                idUczen = jdo.idUczen

            let formOcenyPosumowanie = {
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
            let formData = JSON.stringify(formOcenyPosumowanie)
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
                        const ocenyKlsyfikacyjneJson = json["Data"]["OcenyKlasyfikacyjne"]
                        const ocenyPrzewidywaneJson = json["Data"]["OcenyPrzewidywane"]
                        const srednieOcenJson = json["Data"]["SrednieOcen"]
                        let przedmioty
                        const ocenyKlasyfikacyjneLista = [], ocenyProponowaneLista = [], srednieOcenLista = []

                        ocenyKlsyfikacyjneJson.forEach(function (item) {
                                ocenyKlasyfikacyjneLista.push(item["Wpis"] + ",,," + item["IdPrzedmiot"])
                            }
                        )
                        ocenyPrzewidywaneJson.forEach(function (item) {
                                ocenyProponowaneLista.push(item["Wpis"] + ",,," + item["IdPrzedmiot"])
                            }
                        )
                        srednieOcenJson.forEach(function (item) {
                                srednieOcenLista.push(item["SredniaOcen"] + ",,," + item["SumaPunktow"] + ",,," + item["IdPrzedmiot"])
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
                                przedmioty = data["Przedmioty"]

                                if (ocenyKlasyfikacyjneLista.length > 0) {
                                    let tabOceny = [] //Tablica z stringami ["Matematyka: 5, 5-, 3+","Przyroda: 3, 1, 2+"]
                                    przedmioty.forEach(function (przedmiot) {
                                        let sameOcenyTab = []
                                        srednieOcenLista.forEach(function (ocena) {
                                            let cale = ocena.split(",,,")
                                            if (przedmiot["Id"].toString() === cale[2]) {
                                                sameOcenyTab.push("śr. " + cale[0])
                                            }
                                        })
                                        ocenyProponowaneLista.forEach(function (ocena) {
                                            let cale = ocena.split(",,,")
                                            if (przedmiot["Id"].toString() === cale[1]) {
                                                sameOcenyTab.push("p. " + cale[0])
                                            }
                                        })
                                        ocenyKlasyfikacyjneLista.forEach(function (ocena) {
                                            let cale = ocena.split(",,,")
                                            if (przedmiot["Id"].toString() === cale[1]) {
                                                sameOcenyTab.push("k. " + cale[0])
                                            }
                                        })
                                        if (sameOcenyTab.length > 0) {
                                            let stringDoPush = sameOcenyTab.join("  ") + " - " + przedmiot["Nazwa"]
                                            tabOceny.push(stringDoPush)
                                        }
                                    })
                                    if (tabOceny.length > 0) {
                                        message.channel.send("```OCENY - PODSUMOWANIE\nśr - średnia   p - proponowana   k - końcowa\n\n" + tabOceny.join("\n") + "```")
                                    } else message.channel.send("Nie znalazłem ocen z żadnego przedmiotu")

                                } else {
                                    message.channel.send("Nie znalazłem żadnych ocen klasyfikacyjnych")
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
        })()
    }
}
