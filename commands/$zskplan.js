exports.run = (client, message, args) => {

    const jdo = require("../wrazliweDane.json")
    let pozycja = null
    jdo.forEach(function (item, position) {
        if (item.dcId == message.author.id) pozycja = position
        console.log(`Pozycjaw json: ${pozycja}`)
    })
    if (pozycja == null) {
        message.channel.send("najpierw musisz się zalogować używając komendy: `$zsklogin [token] [symbol] [pin]`")
        return
    }
    if ((args[0] !== "dzisiaj" && args[0] !== "jutro") && (isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2]))) {
        message.channel.send("Podano nieprawidłowe dane. Poprawne użycie: `$zskplan dzisiaj / jutro / [rok] [miesiąc] [dzień]`")
        return
    }

    const uuidv4 = require('uuidv4'),
        signer = require("@wulkanowy/uonet-request-signer"),
        request = require("request"),
        Discord = require('discord.js'),
        uonet = require("../uonet.js"),

        certificateKey1 = jdo[pozycja].certyfikatKlucz,
        password1 = require("../auth.json").password,
        certificate1 = jdo[pozycja].certyfikatPfx,
        urlPlan = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/PlanLekcjiZeZmianami',
        timekey = Math.floor(Date.now() / 1000),
        timekey1 = timekey - 1,
        idOddzial = jdo[pozycja].idOddzial,
        idOkresKlasyfikacyjny = jdo[pozycja].idOkresKlasyfikacyjny,
        idUczen = jdo[pozycja].idUczen,

        d = new Date(),
        rokWybrany = args[0] === "dzisiaj" || args[0] === "jutro" ? d.getFullYear() : args[0],
        miesiacWybrany = args[0] === "dzisiaj" || args[0] === "jutro" ? d.getMonth() + 1 : args[1],
        dzienWybrany = args[0] === "dzisiaj" ? d.getDate() : args[0] === "jutro" ? d.getDate() + 1 : args[2],
        dtw = new Date().setFullYear(rokWybrany, miesiacWybrany - 1, dzienWybrany),
        dzienTygWybrany = args[0] === "dzisiaj" ? d.getDay() : args[0] === "jutro" ? d.getDay() + 1 > 6 ? 0 : d.getDay() : new Date(dtw).getDay(),
        days = ["Niedziela", "Poniedziałek", "Wtorek", "środa", "Czwartek", "Piątek", "Sobota"],
        dzienNazwa = days[dzienTygWybrany],

        mdd = miesiacWybrany < 10 ? "0" + miesiacWybrany : miesiacWybrany,
        ddd = dzienWybrany < 10 ? "0" + dzienWybrany : dzienWybrany,
        dataWybrana = rokWybrany + "-" + mdd + "-" + ddd,

        dataPoczatkowa = uonet.getDataPoczatkowa(rokWybrany, miesiacWybrany, dzienWybrany, dzienTygWybrany),
        dataKoncowa = uonet.getDataKoncowa(rokWybrany, miesiacWybrany, dzienWybrany, dzienTygWybrany)

    console.log(`DataWybrana: ${dataWybrana}`)
    console.log(`Data początkowa: ${dataPoczatkowa}`)
    console.log(`Data koncowa: ${dataKoncowa}`)

    let formPlan = {
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
    let formData = JSON.stringify(formPlan)

    signer.signContent(password1, certificate1, formData).then(signed => {
        message.channel.startTyping()
        request({
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'RequestCertificateKey': certificateKey1,
                'RequestSignatureValue': signed,
                'User-Agent': 'MobileUserAgent'
            },
            url: urlPlan,
            body: formData,
            method: 'POST'
        }, function (err, res, body) {
            const json = JSON.parse(body);
            console.log("Status: " + json.Status);
            const lekcje = json.Data
            const tabwynik = []
            let lekcja = "", co = "", gdzie = ""

            lekcje.forEach(function (item) {
                    if (item.DzienTekst === dataWybrana && item.PlanUcznia === true) {
                        tabwynik.push(item.NumerLekcji + "," + item.Sala + "," + item.PrzedmiotNazwa)
                    }
                }
            )
            if (tabwynik.length > 0) {
                tabwynik.sort()
                tabwynik.forEach(function (item) {
                    cale = item.split(",")
                    lekcja += cale[0] + "\n"
                    gdzie += cale[1] + "\n"
                    co += cale[2] + "\n"
                })
                let Embed = new Discord.RichEmbed()
                    .setTitle(`**PLAN LEKCJI - ${dzienNazwa}**`)
                    .setColor("#58ff1d")
                    .addField("Nr", lekcja, true)
                    .addField("Sala", gdzie, true)
                    .addField("Przedmiot", co, true)
                message.channel.send(Embed);
            } else {
                message.channel.send("Nie znalazłem żadnej lekcjitego dnia.")
            }
            message.channel.stopTyping()
        });
    });
}
