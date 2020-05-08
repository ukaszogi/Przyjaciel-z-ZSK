exports.run = (client, message, args) => {
    let luckyNumber = "";
    const uuidv4 = require('uuidv4')
    const request = require('request');
    const querystring = require('querystring');
    const url2 = 'https://lekcjaplus.vulcan.net.pl/poznan/000088/mobile-api/Uczen.v3.Uczen/PlanLekcjiZeZmianami';
    const options2 = {
        url: url2,
        headers: {
            'User-Agent': 'MobileUserAgent',
            'RequestCertificateKey': '25C8C2B92B787190C29E260662504F53D0599768',
            'RequestSignatureValue': 'RDHkn6wuXvce2egwNcAxNi50EPfC0Trg1SUDiawj7nq34jrLxYHrpGbc4ET0d+fX86kyGEVkt3saxp8um4xEfUFhV32Sk3GSS9i8knXOJF5a8wSPVNzxyDUh2C6RvNB635g0/g2FhmMUp/FkJH8PbUuOz5BSnBkCQM8SVfoD8iU=',
            'Content-Type': 'application/json; charset=UTF-8'/*,
            'RequestCertificatePassword": "CE75EA598C7743AD9B0B7328DED85B06",
            'RequestCertificatePfx": "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"
        */},
        form: {
            DataPoczatkowa: '2020-05-11',
            DataKoncowa: '2020-05-17',
            IdUczen: 41348,
            IdOddzial: 1512,
            IdOkresKlasyfikacyjny: 11611,
            RemoteMobileTimeKey: Math.floor(Date.now() / 1000),
            TimeKey: Math.floor(Date.now() / 1000)-1,
            RequestId: uuidv4.uuid(),
            RemoteMobileAppVersion: '19.4.1.436',
            RemoteMobileAppName: 'VULCAN-Android-ModulUcznia'
        },
        json: true,
        method: 'post',
    };
    var h = null;
    request.post(options2, function (err, res, body) {
        // let json = JSON.parse(body);
        console.log(body);
        // h = res.headers;
        luckyNumber = body
        message.channel.send("```\n" + luckyNumber + "\n```")
    });

}
