module.exports = {
    name: "zadania",
    description: "Pokazuje zadania na najbliższy miesiąc",
    aliases: ['zad', 'z'],
    usage: 'zadania',
    category: 'vulcan',
    execute(client, message) {

        const Keyv = require("keyv")
        const keyv = new Keyv(require("../config.json").pathToDatabase)
        let jdo

        (async () => {
            console.log(await keyv.get(message.author.id))
            let jestWBazie = await keyv.get(message.author.id)
            console.log("jest w bazie: " + jestWBazie)
            if (!jestWBazie) {
                message.channel.send("najpierw musisz się zalogować pisząc bezpośrednio **do mnie** prywatną wiadomość używając komendy: `" + client.config.prefix + "login [token] [symbol] [pin]`")
                return
            }
            jdo = JSON.parse((await keyv.get(message.author.id)).toString())


            const uuidv4 = require('uuidv4'),
                signer = require("@wulkanowy/uonet-request-signer-node"),
                request = require("request"),
                uonet = require("../uonet.js"),

                certificateKey1 = jdo.certyfikatKlucz,
                password1 = require("../config.json").password,
                certificate1 = jdo.certyfikatPfx,
                urlSprawdziany = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/ZadaniaDomowe`,
                urlSlowniki = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/Slowniki`,
                timekey = Math.floor(Date.now() / 1000),
                timekey1 = timekey - 1,
                idOddzial = jdo.idOddzial,
                idOkresKlasyfikacyjny = jdo.idOkresKlasyfikacyjny,
                idUczen = jdo.idUczen,

                d = new Date(),
                rokWybrany = d.getFullYear(),
                miesiacWybrany = d.getMonth() + 1,
                dzienWybrany = d.getDate(),
                dzienTygWybrany = d.getDay(),

                dataPoczatkowa = uonet.getDataPoczatkowa(rokWybrany, miesiacWybrany, dzienWybrany, dzienTygWybrany),
                dataKoncowa = uonet.getDataKoncowa(rokWybrany, miesiacWybrany + 1, dzienWybrany, dzienTygWybrany)

            console.log(`Data początkowa: ${dataPoczatkowa}`)
            console.log(`Data koncowa: ${dataKoncowa}`)

            let formZadaniaDomowe = {
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
            let formData = JSON.stringify(formZadaniaDomowe)
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
                    const zadaniaJson = json.Data
                    let nauczyciele, przedmioty
                    const zadaniaLista = []
                    let opis, dataTekst, przedmiot, nauczyciel

                    zadaniaJson.forEach(function (item) {
                            zadaniaLista.push(item["DataTekst"] + ",,," + item["Opis"] + ",,," + item["IdPrzedmiot"] + ",,," + item["IdPracownik"])
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

                            if (zadaniaLista.length > 0) {
                                zadaniaLista.sort()
                                let liData = 0, liOpis = 0, liPrzedmiot = 0
                                zadaniaLista.forEach(function (item) {
                                    let cale = item.split(",,,")
                                    if (cale[0].length > liData) liData = cale[0].length
                                    if (cale[1].length > liOpis) liOpis = cale[1].length
                                    przedmioty.forEach(function (item) {
                                        if (item["Id"].toString() === cale[2]) {
                                            let nazwa = item["Nazwa"]
                                            if (nazwa.length > liPrzedmiot) liPrzedmiot = nazwa.length
                                        }
                                    })
                                })
                                let calusienkie = `\nZADANIA DOMOWE\ndata${spacja(liData - 1)}opis${spacja(liOpis - 1)}przedmiot${spacja(liPrzedmiot - 6)}nauczyciel\n`
                                zadaniaLista.forEach(function (item) {
                                    let cale = item.split(",,,")
                                    dataTekst = cale[0]
                                    opis = cale[1]
                                    if (opis.length === 0) opis = "(Brak opisu)"
                                    przedmioty.forEach(function (item) {
                                        if (item["Id"].toString() === cale[2]) przedmiot = item["Nazwa"]
                                    })
                                    nauczyciele.forEach(function (item) {
                                        if (item["Id"].toString() === cale[3]) nauczyciel = item["Imie"] + " " + item["Nazwisko"]
                                    })
                                    calusienkie += dataTekst + spacja(3 + liData - dataTekst.length) + opis + spacja(3 + liOpis - opis.length) + przedmiot + spacja(3 + liPrzedmiot - przedmiot.length) + nauczyciel + "\n"

                                })
                                message.channel.send("```" + calusienkie + "```")
                            } else {
                                message.channel.send("Nie znalazłem żadnych zadań domowych na następny miesiąc.")
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
        })()
    }
}
