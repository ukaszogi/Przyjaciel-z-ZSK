module.exports = {
    name: "sprawdziany",
    description: "Pokazuje kartkówki i sprawdziany na następny miesiąc",
    aliases: ['s', 'spr', 'kart', 'kartkówki', 'kartkowki', 'k'],
    usage: 'sprawdziany',
    category: 'vulcan',
    execute(client, message) {

        const jdo = require("../wrazliweDane.json")
        let pozycja = null
        jdo.forEach(function (item, position) {
            if (item.dcId.toString() === message.author.id) pozycja = position
            console.log(`Pozycjaw json: ${pozycja}`)
        })
        if (pozycja == null) {
            message.channel.send("najpierw musisz się zalogować pisząc bezpośrednio **do mnie** prywatną wiadomość używając komendy: `$zsklogin [token] [symbol] [pin]`")
            return
        }

        const uuidv4 = require('uuidv4'),
            signer = require("@wulkanowy/uonet-request-signer-node"),
            request = require("request"),
            uonet = require("../uonet.js"),

            certificateKey1 = jdo[pozycja].certyfikatKlucz,
            password1 = require("../auth.json").password,
            certificate1 = jdo[pozycja].certyfikatPfx,
            urlSprawdziany = `${jdo[pozycja]["adresBazowyRestApi"]}${jdo[pozycja]["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/Sprawdziany`,
            urlSlowniki = `${jdo[pozycja]["adresBazowyRestApi"]}${jdo[pozycja]["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/Slowniki`,
            timekey = Math.floor(Date.now() / 1000),
            timekey1 = timekey - 1,
            idOddzial = jdo[pozycja].idOddzial,
            idOkresKlasyfikacyjny = jdo[pozycja].idOkresKlasyfikacyjny,
            idUczen = jdo[pozycja].idUczen,

            d = new Date(),
            rokWybrany = d.getFullYear(),
            miesiacWybrany = d.getMonth() + 1,
            dzienWybrany = d.getDate(),
            dzienTygWybrany = d.getDay(),

            dataPoczatkowa = uonet.getDataPoczatkowa(rokWybrany, miesiacWybrany, dzienWybrany, dzienTygWybrany),
            dataKoncowa = uonet.getDataKoncowa(rokWybrany, miesiacWybrany+1, dzienWybrany, dzienTygWybrany)

        console.log(`Data początkowa: ${dataPoczatkowa}`)
        console.log(`Data koncowa: ${dataKoncowa}`)

        let formSprawdziany = {
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
        let formData = JSON.stringify(formSprawdziany)
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
                url: urlSprawdziany,
                body: formData,
                method: 'POST'
            }, function (err, res, body) {
                const json = JSON.parse(body);
                console.log("Status: " + json.Status);
                const sprKartJson = json.Data
                let nauczyciele, przedmioty
                const sprawdzianyIKartkowki = []
                let jestSprawdzianem, opis, dataTekst, przedmiot, nauczyciel

                sprKartJson.forEach(function (item) {
                        sprawdzianyIKartkowki.push(item["DataTekst"] + ",,," + item["Rodzaj"] + ",,," + item["Opis"] + ",,," + item["IdPrzedmiot"] + ",,," + item["IdPracownik"])
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
                        nauczyciele = data["Nauczyciele"]
                        przedmioty = data["Przedmioty"]

                        if (sprawdzianyIKartkowki.length > 0) {
                            sprawdzianyIKartkowki.sort()
                            let liData = 0, liOpis = 0, liPrzedmiot = 0
                            sprawdzianyIKartkowki.forEach(function (item) {
                                let cale = item.split(",,,")
                                if (cale[0].length > liData) liData = cale[0].length
                                if (cale[2].length > liOpis) liOpis = cale[2].length
                                przedmioty.forEach(function (item) {
                                    if (item["Id"].toString() === cale[3]) {
                                        let nazwa = item["Nazwa"]
                                        if (nazwa.length > liPrzedmiot) liPrzedmiot = nazwa.length
                                    }
                                })
                            })
                            let calusienkie = `\nSPRAWDZIANY\ndata${spacja(liData - 1)}opis${spacja(liOpis - 1)}przedmiot${spacja(liPrzedmiot - 6)}nauczyciel\n`
                            sprawdzianyIKartkowki.forEach(function (item) {
                                let cale = item.split(",,,")
                                jestSprawdzianem = cale[1]
                                dataTekst = cale[0]
                                opis = cale[2]
                                if (opis.length === 0) opis = "(Brak opisu)"
                                przedmioty.forEach(function (item) {
                                    if (item["Id"].toString() === cale[3]) przedmiot = item["Nazwa"]
                                })
                                nauczyciele.forEach(function (item) {
                                    if (item["Id"].toString() === cale[4]) nauczyciel = item["Imie"] + " " + item["Nazwisko"]
                                })
                                if (jestSprawdzianem === "true") {
                                    calusienkie += dataTekst + spacja(3 + liData - dataTekst.length) + opis + spacja(3 + liOpis - opis.length) + przedmiot + spacja(3 + liPrzedmiot - przedmiot.length) + nauczyciel + "\n"
                                }
                            })
                            calusienkie += `\nKARTKÓWKI\ndata${spacja(liData - 1)}opis${spacja(liOpis - 1)}przedmiot${spacja(liPrzedmiot - 6)}nauczyciel\n`
                            sprawdzianyIKartkowki.forEach(function (item) {
                                let cale = item.split(",,,")
                                jestSprawdzianem = cale[1]
                                dataTekst = cale[0]
                                opis = cale[2]
                                if (opis.length === 0) opis = "(Brak opisu)"
                                przedmioty.forEach(function (item) {
                                    if (item["Id"].toString() === cale[3]) przedmiot = item["Nazwa"]
                                })
                                nauczyciele.forEach(function (item) {
                                    if (item["Id"].toString() === cale[4]) {
                                        nauczyciel = item["Imie"] + " " + item["Nazwisko"]
                                    }
                                })
                                if (jestSprawdzianem === "false") {
                                    calusienkie += dataTekst + spacja(3 + liData - dataTekst.length) + opis + spacja(3 + liOpis - opis.length) + przedmiot + spacja(3 + liPrzedmiot - przedmiot.length) + nauczyciel + "\n"
                                }
                            })
                            message.channel.send("```" + calusienkie + "```")
                        } else {
                            message.channel.send("Nie znalazłem żadnych sprawdzianów na następny miesiąc.")
                        }
                    });
                });
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
    }
}
