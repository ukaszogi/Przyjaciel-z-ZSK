module.exports = {
    name: "frekwencja",
    description: "Pokazuje Frekwencję z aktualnego semestru",
    aliases: ['f', 'frek', 'fr', 'frekwencje'],
    usage: 'frekwencja',
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
            console.log("\njest w bazie: " + (jestWBazie ? "true" : "false") + "\nkto: " + message.author.id)
            if (!jestWBazie) {
                message.channel.send("najpierw musisz się zalogować pisząc bezpośrednio **do mnie** prywatną wiadomość używając komendy: `" + client.config.prefix + "login [token] [symbol] [pin]`")
                return
            }
            jdo = JSON.parse((await keyv.get(message.author.id)).toString())


            const uuidv4 = require('uuidv4'),
                signer = require("@wulkanowy/uonet-request-signer-node"),
                request = require("request"),
                svgToImg = require("svg-to-img"),

                certificateKey1 = jdo.certyfikatKlucz,
                password1 = config.password,
                certificate1 = jdo.certyfikatPfx,
                urlFrekwencje = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/Frekwencje`,
                urlSlowniki = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/Slowniki`,
                timekey = Math.floor(Date.now() / 1000),
                timekey1 = timekey - 1,
                idOddzial = jdo.idOddzial,
                idOkresKlasyfikacyjny = jdo.idOkresKlasyfikacyjny,
                idUczen = jdo.idUczen,

                dataPoczatkowa = jdo.okresDataOdTekst,
                dataKoncowa = jdo.okresDataDoTekst

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
                    if (body.toString() !== "Bad Request") {
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
                                console.log("Status: " + JSON.parse(body).Status);
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
                                                kategoria = item
                                            }
                                        })
                                        if (!kategoria["Obecnosc"]) {
                                            if (cale[0].length > liData) liData = cale[0].length
                                            if (cale[1].length > liPrzedmiot) liPrzedmiot = cale[1].length
                                            if (cale[2].length > liNumer) liNumer = cale[2].length
                                        }
                                    })
                                    let inneNizObecnosc = 0
                                    let undefindy = 0
                                    let calusienkie = `Frekwencja ${dataPoczatkowa} - ${dataKoncowa}\ndata${spacja(liData - 1)}przedmiot${spacja(liPrzedmiot - 6)}nr${spacja(liNumer + 1)}kategoria\n`
                                    tabwynik.forEach(function (item) {
                                        let cale = item.split(",")
                                        let data = cale[0]
                                        let przedmiot = cale[1]
                                        let numer = cale[2]
                                        let kategoria = "(brak kategorii)"
                                        kategorie.forEach(function (item) {
                                            if (item["Id"].toString() === cale[3]) {
                                                kategoria = item
                                            }
                                        })
                                        if (kategoria === undefined)
                                            undefindy++
                                        if (!kategoria["Obecnosc"] && kategoria["Obecnosc"] !== undefined) {
                                            inneNizObecnosc++
                                            let caltest = calusienkie + data + spacja(3 + liData - data.length) +
                                                przedmiot + spacja(3 + liPrzedmiot - przedmiot.length) +
                                                numer + spacja(3 + liNumer - numer.length) +
                                                kategoria["Nazwa"] + "\n"
                                            if (caltest.length < 1982) {
                                                calusienkie +=
                                                    data + spacja(3 + liData - data.length) +
                                                    przedmiot + spacja(3 + liPrzedmiot - przedmiot.length) +
                                                    numer + spacja(3 + liNumer - numer.length) +
                                                    kategoria["Nazwa"] + "\n"
                                            }
                                            else calusienkie += "..."
                                        }
                                    })
                                    let wykresUrl = "https://www.chartgo.com/create.do?charttype=pie&width=700&height=500&chrtbkgndcolor=gradientblue&labelorientation=horizontal&title=Frekwencja&subtitle=&xtitle=&ytitle=&source=&fonttypetitle=bold&fonttypelabel=normal&max_yaxis=&min_yaxis=&threshold=&show3d=1&legend=1&gradient=1&border=1&xaxis1=obecno%C5%9Bci%0D%0Anieobecno%C5%9Bci&yaxis1="
                                    let frekProc = ((((tabwynik.length-undefindy) - inneNizObecnosc) / (tabwynik.length-undefindy)) * 100).toFixed(2)
                                    wykresUrl += frekProc.toString() + "%0D%0A" + (100 - frekProc).toString() + "&group1=Group+1&groupcolor1=defaultgroupcolours&file=&viewsource=mainView&language=en&sectionSetting=false&sectionSpecific=false&sectionData=false&usePost="

                                    let doWyslania = "Frekwencja w tym okresie wynosi: " + frekProc + "%"
                                    if (inneNizObecnosc > 0)
                                        doWyslania += "```" + calusienkie + "```\nwykres:"
                                    else doWyslania += "\nBrak nieobecności"
                                    let cookie
                                    let zdjecie
                                    request({
                                        url: wykresUrl
                                    }, function (err, res) {
                                        cookie = res.headers['set-cookie']
                                        request({
                                            headers: {
                                                "Referer": wykresUrl,
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
                                                    message.channel.send(doWyslania, {files: [zdjecie]})
                                                })();
                                            } catch (e) {
                                                console.log(e)
                                            }
                                        });
                                    })
                                } else {
                                    message.channel.send("Nie znaleziono frekwencji")
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
                let spac = ""
                for (i = 1; i <= ile; i++) {
                    spac += " "
                }
                return spac
            }
        })()
    }
}
