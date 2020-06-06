module.exports = {
    name: "login",
    description: "",
    aliases: ['login'],
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

        const uuidv4 = require('uuidv4')
        const signer = require("@wulkanowy/uonet-request-signer");
        const request = require("request")
        const fs = require("fs")
        const jdo = require("../wrazliweDane.json")
        let isInDatabass = false

        jdo.forEach(function (item) {
            if (item["dcId"] === message.author.id) isInDatabass = true
        })

        if (isInDatabass) {
            message.channel.send("Już jesteś zalogowany. Nie musisz się logować 2 razy")
            return
        }

        const token = args[0],
            symbol = args[1],
            pin = args[2],
            host = "https://lekcjaplus.vulcan.net.pl/",
            firebaseTokenKey = require("../auth.json").FirebaseTokenKey,
            urlCertyfikat = host + symbol + "/mobile-api/Uczen.v3.UczenStart/Certyfikat",
            urlListaUczniow = host + symbol + "/mobile-api/Uczen.v3.UczenStart/ListaUczniow",
            password = require("../auth.json").password,
            timekey = Math.floor(Date.now() / 1000),
            timekey1 = timekey - 1

        let jdz = {
            dcId: message.author.id,
            idOddzial: 0,
            idOkresKlasyfikacyjny: 0,
            idUczen: 0,
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
                        try {
                            let dzejson = JSON.parse(body)
                            jdz.idUczen = dzejson["Data"][0]["Id"]
                            jdz.idOddzial = dzejson["Data"][0]["IdOddzial"]
                            jdz.idOkresKlasyfikacyjny = dzejson["Data"][0]["IdOkresKlasyfikacyjny"]
                            console.log(jdz.idOkresKlasyfikacyjny + "\n" + jdz.idOddzial + "\n" + jdz.idUczen + "\n" + jdz.certyfikatPfx + "\n" + jdz.certyfikatKlucz + "\n")
                            jdo.push(jdz)
                            fs.writeFile("./wrazliweDane.json", JSON.stringify(jdo), (err) => {
                                if (err) console.error(err)
                            });
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
    }
}
