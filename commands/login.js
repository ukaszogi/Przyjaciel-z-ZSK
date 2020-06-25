module.exports = {
    name: "login",
    description: "Pozwala na zalogowanie się do konta Vulcan tokenem, symbolem oraz pinem które używa się do zalogowania w dzienniczek+",
    aliases: ['loguj', 'zaloguj'],
    usage: 'login [token] [symbol] [pin]',
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
        if (message.guild !== null) {
            message.channel.startTyping()
            message.delete()
            message.channel.send(message.author.toString() + " Usunąłem twoją wiadomość dla bezpieczeństwa twojego konta. Aby się zalogować, napisz bezpośrednio **do mnie** prywatną wiadomość `$zsk login [token] [symbol] [pin]`")
            message.channel.stopTyping()
            return
        } else if (args[2] === undefined) {
            message.channel.send("Zbyt mało argumentów!\nPoprawne użycie: `$zsk login [token] [symbol] [pin]` ")
            return
        }
        message.channel.send("Aby zalogować cię do systemu uonet, potrzebujemy przechowywać 'Ceryfikat Pfx' i klucz do niego. Czy zgadzasz się na przechowywanie? Jeżeli tak: zareaguj '👍', a jeżeli nie: zareaguj '👎' na wiadomość.")

        message.react('👍').then(() => message.react('👎'));

        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        message.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '👍') {
                    message.reply('Logowanie...');
                    const uuidv4 = require('uuidv4')
                    const signer = require("@wulkanowy/uonet-request-signer-node");
                    const request = require("request")
                    const Keyv = require("keyv")
                    const keyv = new Keyv(config.pathToDatabase)

                    const token = args[0],
                        symbol = args[1],
                        pin = args[2],
                        host = require("../hosty.json")[token.substr(0, 3)],
                        firebaseTokenKey = config.FirebaseTokenKey,
                        urlCertyfikat = host + symbol + "/mobile-api/Uczen.v3.UczenStart/Certyfikat",
                        urlListaUczniow = host + symbol + "/mobile-api/Uczen.v3.UczenStart/ListaUczniow",
                        password = config.password,
                        timekey = Math.floor(Date.now() / 1000),
                        timekey1 = timekey - 1

                    let jdz = {
                        idOddzial: 0,
                        idOkresKlasyfikacyjny: 0,
                        idUczen: 0,
                        adresBazowyRestApi: "",
                        jsSymbol: 0,
                        okresDataOdTekst: "",
                        okresDataDoTekst: "",
                        certyfikatKlucz: "",
                        certyfikatPfx: ""
                    }

                    const formCertyfikat = {
                        "PIN": pin,
                        "TokenKey": token,
                        "AppVersion": "19.4.1.436",
                        "DeviceId": uuidv4.uuid(),
                        "DeviceName": "Przyjaciel z ZSK",
                        "DeviceNameUser": "Bot",
                        "DeviceDescription": "Bot discorda",
                        "DeviceSystemType": "Android",
                        "DeviceSystemVersion": "6.0.1",
                        "RemoteMobileTimeKey": timekey,
                        "FirebaseTokenKey": firebaseTokenKey,
                        "TimeKey": timekey1,
                        "RequestId": uuidv4.uuid(),
                        "RemoteMobileAppVersion": "19.4.1.436",
                        "RemoteMobileAppName": "VULCAN-Android-ModulUcznia"
                    }
                    const formListaUczniow = {
                        "RemoteMobileTimeKey": timekey,
                        "TimeKey": timekey1,
                        "RequestId": uuidv4.uuid(),
                        "RemoteMobileAppVersion": "19.4.1.436",
                        "RemoteMobileAppName": "VULCAN-Android-ModulUcznia"
                    }

                    request({
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'RequestMobileType': 'RegisterDevice',
                            'User-Agent': 'MobileUserAgent'
                        },
                        url: urlCertyfikat,
                        body: JSON.stringify(formCertyfikat),
                        method: 'POST'
                    }, function (err, res, body) {
                        message.channel.startTyping()
                        try {
                            console.log(body)
                            let json = JSON.parse(body)
                            if (json["IsError"] && json["Message"] === "TokenNotFound") {
                                message.channel.send("Podano nieprawidłowe dane. Przoszę spróbować ponownie")
                                message.channel.stopTyping()
                            } else {
                                jdz.certyfikatKlucz = json["TokenCert"]["CertyfikatKlucz"]
                                jdz.certyfikatPfx = json["TokenCert"]["CertyfikatPfx"]
                                jdz.adresBazowyRestApi = json["TokenCert"]["AdresBazowyRestApi"]

                                signer.signContent(password, jdz.certyfikatPfx, JSON.stringify(formListaUczniow)).then(signed => {
                                    console.log("\n\nsigned\n" + signed + "\n\n\n");
                                    request({
                                        headers: {
                                            'Content-Type': 'application/json; charset=utf-8',
                                            'RequestCertificateKey': jdz.certyfikatKlucz,
                                            'RequestSignatureValue': signed,
                                            'User-Agent': 'MobileUserAgent'
                                        },
                                        url: urlListaUczniow,
                                        body: JSON.stringify(formListaUczniow),
                                        method: 'POST'
                                    }, function (err, res, body) {
                                        console.log(body.toString())
                                        try {
                                            let dzejson = JSON.parse(body);
                                            let pozycja = 0,
                                                konta = `Znaleziono więcej niż jedno konto ucznia. Można zalogować się tylko na jedno konto. Wybierz które:\n`
                                            if (dzejson["Data"].length > 1) {
                                                dzejson["Data"].forEach(function (item, position) {
                                                    konta += `${position + 1}. ` + item["UzytkownikNazwa"] + "\n"
                                                })
                                                (async () => {
                                                    message.channel.send(konta).then(() => {
                                                        const filter = m => isNaN(m.content) && parseInt(m.content) < dzejson["Data"].length && parseInt(m.content) >= 0
                                                        const collector = message.channel.createMessageCollector(filter, {time: 30000});

                                                        collector.on('collect', async m => {
                                                            console.log(`Collected ${parseInt(m.content)} ${parseInt(m.content)} isNaN?: ${isNaN(parseInt(m.content))}`);
                                                            pozycja = parseInt(m.content)
                                                            collector.stop("Logowanie...")
                                                            jdz.idUczen = dzejson["Data"][pozycja]["Id"]
                                                            jdz.idOddzial = dzejson["Data"][pozycja]["IdOddzial"]
                                                            jdz.idOkresKlasyfikacyjny = dzejson["Data"][pozycja]["IdOkresKlasyfikacyjny"]
                                                            jdz.jsSymbol = dzejson["Data"][pozycja]["JednostkaSprawozdawczaSymbol"]
                                                            jdz.okresDataOdTekst = dzejson["Data"][pozycja]["OkresDataOdTekst"]
                                                            jdz.okresDataDoTekst = dzejson["Data"][pozycja]["OkresDataDoTekst"]
                                                            console.log(jdz.idOkresKlasyfikacyjny + "\n" + jdz.idOddzial + "\n" + jdz.idUczen + "\n" + jdz.certyfikatPfx + "\n" + jdz.certyfikatKlucz + "\n");
                                                            await keyv.set(message.author.id, JSON.stringify(jdz))
                                                            console.log(await keyv.get(message.author.id))
                                                        });

                                                        collector.on('end', collected => {
                                                            console.log(`Anulowano logowanie.`);
                                                        });
                                                    });
                                                })()
                                            } else {
                                                (async () => {
                                                    pozycja = 0
                                                    jdz.idUczen = dzejson["Data"][pozycja]["Id"]
                                                    jdz.idOddzial = dzejson["Data"][pozycja]["IdOddzial"]
                                                    jdz.idOkresKlasyfikacyjny = dzejson["Data"][pozycja]["IdOkresKlasyfikacyjny"]
                                                    jdz.jsSymbol = dzejson["Data"][pozycja]["JednostkaSprawozdawczaSymbol"]
                                                    jdz.okresDataOdTekst = dzejson["Data"][pozycja]["OkresDataOdTekst"]
                                                    jdz.okresDataDoTekst = dzejson["Data"][pozycja]["OkresDataDoTekst"]
                                                    console.log(jdz.idOkresKlasyfikacyjny + "\n" + jdz.idOddzial + "\n" + jdz.idUczen + "\n" + jdz.certyfikatPfx + "\n" + jdz.certyfikatKlucz + "\n");
                                                    await keyv.set(message.author.id, JSON.stringify(jdz))
                                                    console.log(await keyv.get(message.author.id))
                                                })()
                                            }
                                            message.channel.send("Zarejestrowano urządzenie mobilne")
                                            message.channel.stopTyping()
                                        } catch (e) {
                                            console.log(e.toString())
                                            message.channel.send("Wystąpił błąd. Prawdopodobnie źle wpisałeś komendę")
                                            message.channel.stopTyping()
                                        }
                                    });
                                });
                            }

                        } catch (e) {
                            console.log(e.toString())
                            message.channel.send("Wystąpił błąd. Prawdopodobnie źle wpisałeś komendę")
                            message.channel.stopTyping()
                        }
                    });
                } else {
                    message.reply('Anulowano Logowanie');
                }
            })
            .catch(collected => {
                message.reply('Nie zareagowano. Anulowano logowanie');
            });

    }
}
