module.exports = {
    name: "uwagi",
    description: "Pokazuje Pochwały i uwagi ucznia",
    aliases: ['u', 'po', 'pochwały', 'uw'],
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
                urlUwagi = `${jdo["adresBazowyRestApi"]}${jdo["jsSymbol"]}/mobile-api/Uczen.v3.Uczen/UwagiUcznia`,
                timekey = Math.floor(Date.now() / 1000),
                timekey1 = timekey - 1,
                idOddzial = jdo.idOddzial,
                idOkresKlasyfikacyjny = jdo.idOkresKlasyfikacyjny,
                idUczen = jdo.idUczen,

                dataPoczatkowa = jdo.okresDataOdTekst,
                dataKoncowa = jdo.okresDataDoTekst

            console.log(`Data początkowa: ${dataPoczatkowa}`)
            console.log(`Data koncowa: ${dataKoncowa}`)

            let formUwagi = {
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
            let formData = JSON.stringify(formUwagi)

            signer.signContent(password1, certificate1, formData).then(signed => {
                message.channel.startTyping()
                request({
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'RequestCertificateKey': certificateKey1,
                        'RequestSignatureValue': signed,
                        'User-Agent': 'MobileUserAgent'
                    },
                    url: urlUwagi,
                    body: formData,
                    method: 'POST'
                }, function (err, res, body) {
                    if (body.toString() !== "Bad Request") {
                        const json = JSON.parse(body);
                        console.log("Status: " + json.Status);
                        const uwagiJson = json["Data"]
                        let tabwynik = []

                        uwagiJson.forEach(function (item) {
                                tabwynik.push(item["DataWpisuTekst"] + "," + item["PracownikImie"] + " " + item["PracownikNazwisko"] + "," + item["TrescUwagi"])
                            }
                        )

                        if (tabwynik.length > 0) {
                            tabwynik.sort()
                            tabwynik.reverse()
                            let calusienkie = `POCHWAŁY I UWAGI ${dataPoczatkowa} - ${dataKoncowa}\n`
                            tabwynik.forEach(function (item) {
                                let cale = item.split(",")
                                let data = cale[0]
                                let tresc = cale[1]
                                let nauczyciel = cale[2]
                                let caltest = calusienkie + data + "  " + tresc + "  " + nauczyciel + "\n"
                                if (caltest.length < 2000) calusienkie += data + "  " + tresc + "  " + nauczyciel + "\n"

                            })
                            message.channel.send("```" + calusienkie + "```")
                        } else {
                            message.channel.send("Nie znaleziono żadnych pochwał i uwag")
                        }
                    } else {
                        console.log("Bad Request")
                        message.channel.send("Coś poszło nie tak. Prawdopodobie wyrejestrowałeś/aś urządzenie na stronie internetowej. Sprawdź czy \"Przyjaciel z ZSK\" nadal widnieje na liście zarejestrowanych urządzeń. Jeżeli nie: zaloguj się ponownie.")
                    }

                    message.channel.stopTyping()
                });
            });
        })()
    }
}
