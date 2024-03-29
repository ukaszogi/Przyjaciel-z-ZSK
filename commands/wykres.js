module.exports = {
    name: "wykres",
    description: "Pokazuje wykres czasu dostania oceny od średniej ocen z podanego przedmiotu lub z wszystkich przedmiotów",
    "aliases": ['w', 'wyk', 'wykres'],
    usage: 'wykres wszystkie | [pełna nazwa przedmiotu]',
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
                svgToImg = require("svg-to-img"),
                signer = require("@wulkanowy/uonet-request-signer-node"),
                req = require("request"),

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
                    if (body.toString() !== "Bad Request") {
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
                                console.log("Status: " + JSON.parse(body).Status);
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
                                            url: "https://www.chartgo.com/downloadSVG.do",
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
