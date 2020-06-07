module.exports = {
    name: "wykres",
    description: "Pokazuje wykres czasu dostania oceny od średniej ocen z podanego przedmiotu lub z wszystkich przedmiotów",
    "aliases": ['w', 'wyk', 'wykres'],
    usage: 'wykres wszystkie | [pełna nazwa przedmiotu]',
    execute(client, message, args) {

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
            svgToImg = require("svg-to-img"),
            signer = require("@wulkanowy/uonet-request-signer"),
            req = require("request"),

            certificateKey1 = jdo[pozycja].certyfikatKlucz,
            password1 = require("../auth.json").password,
            certificate1 = jdo[pozycja].certyfikatPfx,
            urlOceny = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/Oceny',
            urlSlowniki = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/Slowniki',
            timekey = Math.floor(Date.now() / 1000),
            timekey1 = timekey - 1,
            idOkresKlasyfikacyjny = jdo[pozycja].idOkresKlasyfikacyjny,
            idUczen = jdo[pozycja].idUczen

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
            req({
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
                const json = JSON.parse(body);
                console.log("Status: " + json.Status);
                const ocenyJson = json.Data
                const ocenyLista = []

                ocenyJson.forEach(function (item) {
                        ocenyLista.push(item["DataUtworzeniaTekst"] + ",,," + item["Wartosc"] + ",,," + item["WagaModyfikatora"] + ",,," + item["WagaOceny"] + ",,," + item["IdPrzedmiot"])
                    }
                )

                signer.signContent(password1, certificate1, formData2).then(signed2 => {
                    req({
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
                        let przedmioty = data["Przedmioty"]
                        let zdjecie

                        if (ocenyLista.length > 0) {
                            ocenyLista.sort()
                            let sredniaGora = 0, sredniaDol = 0, srednieLista = [], datyLista = []
                            let urlDoZdjeciaReferer = "https://www.chartgo.com/create.do?charttype=line&width=1400&height=1000&chrtbkgndcolor=gradientblue&labelorientation=horizontal&title=Wykres+Ocen&subtitle=&xtitle=&ytitle=&source=&fonttypetitle=bold&fonttypelabel=normal&max_yaxis=&min_yaxis=&threshold=&gridlines=1&legend=1&labels=1&gradient=1&shadow=1&border=1&roundedge=1&xaxis1="
                            ocenyLista.forEach(function (item) {
                                let ocenkaDane = item.split(",,,")
                                let przedmiot = ""
                                przedmioty.forEach(function (item) {
                                    if (item["Id"].toString() === ocenkaDane[4]) {
                                        przedmiot = item["Nazwa"].toLowerCase()
                                    }
                                })
                                if ((przedmiot === przedmiotWybrany || przedmiotWybrany === "wszystkie") && !isNaN(parseFloat(ocenkaDane[1]))) {
                                    let wartosc = parseFloat(ocenkaDane[1])
                                    let wagamod = parseFloat(ocenkaDane[2])
                                    let wagaoce = parseFloat(ocenkaDane[3])
                                    let pelnaWartosc = isNaN(wagamod) ? wartosc : wartosc + wagamod
                                    sredniaGora += pelnaWartosc * wagaoce
                                    sredniaDol += wagaoce
                                    srednieLista.push((sredniaGora / sredniaDol).toFixed(2))
                                    datyLista.push(ocenkaDane[0])
                                }
                            })
                            datyLista.forEach(function (item) {
                                urlDoZdjeciaReferer += item + "%0D%0A"
                            })
                            urlDoZdjeciaReferer = urlDoZdjeciaReferer.slice(0, -6) + "&yaxis1="
                            srednieLista.forEach(function (item) {
                                urlDoZdjeciaReferer += item + "%0D%0A"
                            })
                            urlDoZdjeciaReferer = urlDoZdjeciaReferer.slice(0, -6) + "&group1=Group+1&groupcolor1=blue&file=&viewsource=mainView&language=en&sectionSetting=&sectionSpecific=&sectionData=&usePost="

                            let cookie
                            req({
                                url: urlDoZdjeciaReferer
                            }, function (err, res) {
                                cookie = res.headers['set-cookie']
                                req({
                                    headers: {
                                        "Referer": urlDoZdjeciaReferer,
                                        "User-Agent": "Mozilla/5.0",
                                        "Accept-Encoding": "gzip, deflate, br",
                                        "Host": "www.chartgo.com",
                                        "Cookie": cookie
                                    },
                                    url: "https://www.chartgo.com//downloadSVG.do",
                                }, function (err, res, body) {
                                    try {
                                        (async () => {
                                            let bodziak = body.toString().substr(body.search("<svg"), body.length - body.search("<svg"))
                                            zdjecie = await svgToImg.from(bodziak).toPng({
                                                width: 1400
                                            });
                                            message.channel.send("wykres:", {files: [zdjecie]})
                                        })();
                                    } catch (e) {
                                        console.log(e)
                                    }
                                });
                            })

                        } else {
                            message.channel.send("Nie znalazłem żadnych ocen")
                        }
                    });
                });
            });
            message.channel.stopTyping()
        });
    }
}
