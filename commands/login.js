module.exports = {
    name: "login",
    description: "Pozwala na zalogowanie się do konta Vulcan tokenem, symbolem oraz pinem które używa się do zalogowania w dzienniczek+",
    aliases: ['loguj', 'zaloguj'],
    usage: 'login [token] [symbol] [pin]',
    category: 'vulcan',
    execute(client, message, args) {
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
                    const keyv = new Keyv(require("../config.json").pathToDatabase)

                    const token = args[0],
                        symbol = args[1],
                        pin = args[2],
                        host = "https://lekcjaplus.vulcan.net.pl/",
                        firebaseTokenKey = require("../config.json").FirebaseTokenKey,
                        urlCertyfikat = host + symbol + "/mobile-api/Uczen.v3.UczenStart/Certyfikat",
                        urlListaUczniow = host + symbol + "/mobile-api/Uczen.v3.UczenStart/ListaUczniow",
                        password = require("../config.json").password,
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
                                        let dzejson = JSON.parse(body)
                                        jdz.idUczen = dzejson["Data"][0]["Id"]
                                        jdz.idOddzial = dzejson["Data"][0]["IdOddzial"]
                                        jdz.idOkresKlasyfikacyjny = dzejson["Data"][0]["IdOkresKlasyfikacyjny"]
                                        jdz.jsSymbol = dzejson["Data"][0]["JednostkaSprawozdawczaSymbol"]
                                        jdz.okresDataOdTekst = dzejson["Data"][0]["OkresDataOdTekst"]
                                        jdz.okresDataDoTekst = dzejson["Data"][0]["OkresDataDoTekst"]
                                        console.log(jdz.idOkresKlasyfikacyjny + "\n" + jdz.idOddzial + "\n" + jdz.idUczen + "\n" + jdz.certyfikatPfx + "\n" + jdz.certyfikatKlucz + "\n");
                                        (async () => {
                                            await keyv.set(message.author.id, JSON.stringify(jdz))
                                            console.log(await keyv.get(message.author.id))
                                        })()
                                        message.channel.send("Zarejestrowano urządzenie mobilne")
                                        message.channel.stopTyping()
                                    } catch (e) {
                                        console.log(e.toString())
                                        message.channel.send("Wystąpił błąd. Prawdopodobnie źle wpisałeś komendę")
                                        message.channel.stopTyping()
                                    }
                                });
                            });

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
                message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
            });

    }
}
