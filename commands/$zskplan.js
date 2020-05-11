exports.run = (client, message, args) => {
    const uuidv4 = require('uuidv4')
    const signer = require("@wulkanowy/uonet-request-signer");
    const request = require("request")
    let signeded = ""
    const urlPlan = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/PlanLekcjiZeZmianami';
    let timekey = Math.floor(Date.now() / 1000)
    let timekey1 = timekey - 1
    let formPlan = {
        "DataPoczatkowa": "2020-05-11",
        "DataKoncowa": "2020-05-17",
        "IdOddzial": 1512,
        "IdOkresKlasyfikacyjny": 11611,
        "IdUczen": 41348,
        "RemoteMobileTimeKey": timekey,
        "TimeKey": timekey1,
        "RequestId": uuidv4.uuid(),
        "RemoteMobileAppVersion": "19.4.1.436",
        "RemoteMobileAppName": "VULCAN-Android-ModulUcznia"
    }
    let formData = JSON.stringify(formPlan)

    let password1 = "CE75EA598C7743AD9B0B7328DED85B06"
    let certificate1 = "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"

    signer.signContent(password1, certificate1, formData).then(signed => {
        console.log("\n\nsigned\n" + signed + "\n\n\n");
        signeded = signed
        request({
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'RequestCertificateKey': 'A5CB6325027FED59C7283A0481CC711523496976',
                'RequestSignatureValue': signeded,
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
            lekcje.forEach( function (item) {
                    if (item.DzienTekst === "2020-05-11" && item.PlanUcznia === true) {
                        tabwynik.push(item.NumerLekcji + ". Sala " + item.Sala + " - " + item.PrzedmiotNazwa +"\n")
                        tabwynik.sort()
                    }
                }
            )
            wynik = ""
            tabwynik.forEach(function (item) {
                wynik+=item
            })
            message.channel.send("```" + wynik + "```");
        });
    });


}
