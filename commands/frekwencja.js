module.exports = {
    name: "frekwencja",
    description: "Pokazuje Frekwencję z aktualnego semestru",
    aliases: ['f', 'frek', 'fr', 'frekwencje'],
    usage: 'frekwencja',
    category: 'vulcan',
    execute(client, message, args) {

        const jdo = require("../wrazliweDane.json")
        let pozycja = null
        jdo.forEach(function (item, position) {
            if (item["dcId"] === message.author.id) pozycja = position
            console.log(`Pozycjaw json: ${pozycja}`)
        })
        if (pozycja == null) {
            message.channel.send("najpierw musisz się zalogować pisząc bezpośrednio **do mnie** prywatną wiadomość używając komendy: `$zsk login [token] [symbol] [pin]`")
            return
        }
        // if (args.length < 1) args.push("wszystkie")
        // else if (args[0] !== "wszystkie" && args[0] !== "1" && args[0] !== "2") {
        //     message.channel.send("Podano nieprawidłowe dane. Poprawne użycie: `" + client.config.prefix + this.usage + "`")
        //     return
        // }

        const uuidv4 = require('uuidv4'),
            signer = require("@wulkanowy/uonet-request-signer-node"),
            request = require("request"),

            certificateKey1 = jdo[pozycja].certyfikatKlucz,
            password1 = require("../auth.json").password,
            certificate1 = jdo[pozycja].certyfikatPfx,
            urlFrekwencje = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/Frekwencje',
            urlSlowniki = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/Slowniki',
            timekey = Math.floor(Date.now() / 1000),
            timekey1 = timekey - 1,
            idOddzial = jdo[pozycja].idOddzial,
            idOkresKlasyfikacyjny = jdo[pozycja].idOkresKlasyfikacyjny,
            idUczen = jdo[pozycja].idUczen,

            dataPoczatkowa = jdo[pozycja].okresDataOdTekst,
            dataKoncowa = jdo[pozycja].okresDataDoTekst

        console.log(`Data początkowa: ${dataPoczatkowa}`)
        console.log(`Data koncowa: ${dataKoncowa}`)

        let formFrekwencje = {
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
        let formData = JSON.stringify(formFrekwencje)
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
                url: urlFrekwencje,
                body: formData,
                method: 'POST'
            }, function (err, res, body) {
                const json = JSON.parse(body);
                console.log("Status: " + json.Status);
                const frekwencjeJson = json["Data"]["Frekwencje"]
                const tabwynik = []

                frekwencjeJson.forEach(function (item) {
                        tabwynik.push(item["DzienTekst"] + "," + item["PrzedmiotNazwa"] + "," + item["Numer"] + "," + item["IdKategoria"])
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
                        let kategorie = data["KategorieFrekwencji"]

                        if (tabwynik.length > 0) {
                            tabwynik.sort()
                            tabwynik.reverse()
                            let liData = 0, liPrzedmiot = 0, liNumer = 0
                            tabwynik.forEach(function (item) {
                                let cale = item.split(",")
                                let kategoria = "(brak kategorii)"
                                kategorie.forEach(function (item) {
                                    if (item["Id"].toString() === cale[3]) {
                                        kategoria = item["Nazwa"]
                                    }
                                })
                                if (kategoria !== 'obecność') {
                                    if (cale[0].length > liData) liData = cale[0].length
                                    if (cale[1].length > liPrzedmiot) liPrzedmiot = cale[1].length
                                    if (cale[2].length > liNumer) liNumer = cale[2].length
                                }
                            })
                            let inneNizObecnosc = 0
                            let calusienkie = `Frekwencja ${dataPoczatkowa} - ${dataKoncowa}\ndata${spacja(liData - 1)}przedmiot${spacja(liPrzedmiot - 6)}nr${spacja(liNumer + 1)}kategoria\n`
                            tabwynik.forEach(function (item) {
                                let cale = item.split(",")
                                let data = cale[0]
                                let przedmiot = cale[1]
                                let numer = cale[2]
                                let kategoria = "(brak kategorii)"
                                let inneNizObecnosc = 0
                                kategorie.forEach(function (item) {
                                    if (item["Id"].toString() === cale[3]) {
                                        kategoria = item
                                    }
                                })
                                if (!kategoria["Obecnosc"]) {
                                    inneNizObecnosc++
                                    let caltest = calusienkie + data + spacja(3 + liData - data.length) +
                                        przedmiot + spacja(3 + liPrzedmiot - przedmiot.length) +
                                        numer + spacja(3 + liNumer - numer.length) +
                                        kategoria + "\n"
                                    if (caltest.length < 2000)
                                        calusienkie +=
                                            data + spacja(3 + liData - data.length) +
                                            przedmiot + spacja(3 + liPrzedmiot - przedmiot.length) +
                                            numer + spacja(3 + liNumer - numer.length) +
                                            kategoria + "\n"
                                }
                            })
                            let frekProc = (((tabwynik.length - inneNizObecnosc) / tabwynik.length) * 100).toFixed(2)
                            message.channel.send("Frekwencja w tym okresie wynosi: " + frekProc + "%")
                            if (inneNizObecnosc > 0)
                                message.channel.send("```" + calusienkie + "```")
                            else message.channel.send("Brak nieobecności")
                        } else {
                            message.channel.send("Nie znaleziono frekwencji")
                        }
                    });
                });

                message.channel.stopTyping()
            });
        });

        function spacja(ile) {
            let spac = ""
            for (i = 1; i <= ile; i++) {
                spac += " "
            }
            return spac
        }
    }
}
