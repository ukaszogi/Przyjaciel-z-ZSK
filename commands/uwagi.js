module.exports = {
    name: "uwagi",
    description: "Pokazuje Pochwały i uwagi ucznia",
    aliases: ['u', 'po', 'pochwały', 'uw'],
    usage: 'frekwencja',
    category: 'vulcan',
    execute(client, message/*, args*/) {

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
            urlUwagi = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/UwagiUcznia',
            timekey = Math.floor(Date.now() / 1000),
            timekey1 = timekey - 1,
            idOddzial = jdo[pozycja].idOddzial,
            idOkresKlasyfikacyjny = jdo[pozycja].idOkresKlasyfikacyjny,
            idUczen = jdo[pozycja].idUczen,

            dataPoczatkowa = jdo[pozycja].okresDataOdTekst,
            dataKoncowa = jdo[pozycja].okresDataDoTekst

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

                message.channel.stopTyping()
            });
        });
    }
}
