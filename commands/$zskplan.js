exports.run = (client, message, args) => {
    const uuidv4 = require('uuidv4')
    const signer = require("@wulkanowy/uonet-request-signer");
    const request = require("request")
    const Discord = require('discord.js');
    const jdo = require("../wrazliweDane.json")
    let pozycja = null

    jdo.forEach(function (item, position) {
        if (item.dcId==message.author.id) pozycja = position
        console.log(pozycja)
    })

    if (pozycja == null) {
        message.channel.send("najpierw musisz się zalogować używając komendy: `$zsklogin [token] [symbol] [pin]`")
        return
    }

    const certificateKey1 = jdo[pozycja].certyfikatKlucz
    const password1 = require("../auth.json").password
    const certificate1 = jdo[pozycja].certyfikatPfx
    const urlPlan = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/PlanLekcjiZeZmianami';
    const timekey = Math.floor(Date.now() / 1000)
    const timekey1 = timekey - 1
    const idOddzial = jdo[pozycja].idOddzial
    const idOkresKlasyfikacyjny = jdo[pozycja].idOkresKlasyfikacyjny
    const idUczen = jdo[pozycja].idUczen
    const d = new Date()
    let dataPoczatkowa = null, dataKoncowa = null, dataWybrana = null
    let rokWybrany = args[0], miesiacWybrany = args[1], dzienWybrany = args[2], dzienTygWybrany = null, dzienNazwa = null
    let rokPocz = null, miesiacPocz = null, dzienPocz = null
    let rokKon = null, miesiacKon = 0, dzienKon = null

    console.log(`args[0] = ${args[0]}, args[1] = ${args[1]}, args[2] = ${args[2]}, `)

    let days = ["Niedziela", "Poniedziałek", "Wtorek", "środa", "Czwartek", "Piątek", "Sobota"];
    if (args[0]=="dzisiaj") {
        rokWybrany = d.getFullYear()
        miesiacWybrany = d.getMonth()+1
        dzienWybrany = d.getDate()
        dzienTygWybrany = d.getDay()
        dzienNazwa = days[d.getDay()]
        mdd = null
        if (miesiacWybrany<10) mdd = "0"+miesiacWybrany
        dataWybrana = rokWybrany+"-"+mdd+"-"+dzienWybrany
        console.log(dataWybrana)
    } else if (args[0]=="jutro") {
        rokWybrany = d.getFullYear()
        miesiacWybrany = d.getMonth()+1
        dzienWybrany = d.getDate()+1
        dzienTygWybrany = d.getDay()+1
        dzienNazwa = days[dzienTygWybrany]
        mdd = null
        if (miesiacWybrany<10) mdd = "0"+miesiacWybrany
        dataWybrana = rokWybrany+"-"+mdd+"-"+dzienWybrany
        console.log(dataWybrana)
    } else {
        rokWybrany = args[0]
        miesiacWybrany = args[1]
        dzienWybrany = args[2]
        dtw = new Date().setFullYear(rokWybrany, miesiacWybrany-1, dzienWybrany)
        dzienTygWybrany = new Date(dtw).getDay()
        let days = ["Niedziela", "Poniedziałek", "Wtorek", "środa", "Czwartek", "Piątek", "Sobota"];
        dzienNazwa = days[dzienTygWybrany]
        mdd = null
        if (miesiacWybrany<10) mdd = "0"+miesiacWybrany
        dataWybrana = rokWybrany+"-"+mdd+"-"+dzienWybrany
    }

    if (dzienWybrany - (dzienTygWybrany - 1) < 0 && miesiacWybrany-1>0) {
        rokPocz = rokWybrany
        miesiacPocz = miesiacWybrany-1
        dzienPocz = new Date(rokWybrany, miesiacWybrany, 0).getDate() + (dzienWybrany - (dzienTygWybrany - 1))
        console.log("1 if pocz")
    } else if (dzienWybrany - (dzienTygWybrany - 1) < 0 && miesiacWybrany-1<=0) {
        rokPocz = rokWybrany-1
        miesiacPocz = 12
        dzienPocz = 31 + (dzienWybrany - (dzienTygWybrany - 1))
        console.log("2 if pocz")
    } else {
        rokPocz = rokWybrany
        miesiacPocz = miesiacWybrany
        dzienPocz = dzienWybrany - (dzienTygWybrany - 1)
        console.log("3 if pocz"+dzienWybrany+dzienTygWybrany)
    }
    if (miesiacPocz<10) miesiacPocz = "0"+miesiacPocz
    if (dzienPocz<10) dzienPocz = "0"+dzienPocz
    dataPoczatkowa = rokPocz + "-" + miesiacPocz + "-" + dzienPocz
    console.log(`\nData początkowa: ` + dataPoczatkowa)

    if (dzienWybrany + (7 - dzienTygWybrany) > new Date(rokWybrany, miesiacWybrany, 0).getDate() && miesiacWybrany < 12) {
        rokKon = rokWybrany
        miesiacKon = 1 + parseInt(miesiacWybrany)
        // if (miesiacKon<10) miesiacKon = "0"+miesiacKon
        dzienKon = (7 - dzienTygWybrany) - (new Date(rokWybrany, miesiacWybrany, 0).getDate() - dzienWybrany)
        console.log("1 if kon")
    } else if (dzienWybrany + (7 - dzienTygWybrany) > new Date(rokWybrany, miesiacWybrany, 0).getDate() && miesiacWybrany >= 12) {
        rokKon = rokWybrany+1
        miesiacKon = 1
        dzienKon = (7 - dzienTygWybrany) - (new Date(rokWybrany, miesiacWybrany, 0).getDate() - dzienWybrany)
        console.log("2 if kon")
    } else {
        rokKon = rokWybrany
        miesiacKon = miesiacWybrany
        dzienKon = dzienWybrany + (7 - dzienTygWybrany)
        console.log("3 if kon")
    }
    if (miesiacKon<10) miesiacKon = "0"+miesiacKon
    if (dzienKon<10) dzienKon = "0"+dzienKon
    dataKoncowa = rokKon + "-" + miesiacKon + "-" + dzienKon
    console.log(`\nData koncowa: ` + dataKoncowa)

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
        console.log("\n\nsigned\n" + signed + "\n\n\n");
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
            var json = JSON.parse(body);
            console.log(body);
            lekcje = json.Data
            tabwynik = []
            var lekcja = "", co = "", gdzie = ""

            lekcje.forEach(function (item) {
                    if (item.DzienTekst == dataWybrana && item.PlanUcznia === true) {
                        tabwynik.push(item.NumerLekcji + "," + item.Sala + "," + item.PrzedmiotNazwa)
                    }
                }
            )
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
            message.channel.stopTyping()
        });
    });


}
