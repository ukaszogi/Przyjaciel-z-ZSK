exports.run = (client, message, args) => {
	const luckyNumber=0;
	const request = require('request');
	const url1 = 'https://cufs.vulcan.net.pl/poznan/Account/LogOn?ReturnUrl=%2Fpoznan%2FFS%2FLS%3Fwa%3Dwsignin1.0%26wtrealm%3Dhttps%253a%252f%252fuonetplus.vulcan.net.pl%252fpoznan%252fLoginEndpoint.aspx%26wctx%3Dhttps%253a%252f%252fuonetplus.vulcan.net.pl%252fpoznan%252fLoginEndpoint.aspx'
	const options = {
		url: url1,
		headers: {
			'User-Agent': 'Mozilla/5.0'
		},
		form: {
			LoginName: "idziejczak3@gmail.com",
			Password: "Kasia222"
		},
		method: 'POST',
		followRedirects: true
	};
	const optionskoniec = {
		url: 'https://uonetplus.vulcan.net.pl/poznan/Start.mvc/GetKidsLuckyNumbers',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		permissions: 'o3s6+gvv61NrMj37N+aNjUVwDhbgse2uff+vmMJdUYI51cwa8xsTdyaMsuh6mHShJOzA/jCShtnF7/ax+CsFMtRzLDF8nVg/yZE67aIlmeToeKOVk9eripU+DK+bKZqn3ESZJ49razqeVZAqYqKbNy28Fq0eUaLT+vJXet8g7zqJBsgUUPsq32a+8qHOdP+8xU0/FWmabWijvh9IHRopSpD1M7T3d8rBvgotf47+HLCOnXvG3Q1RZr2z4HwIgl/HM/At/UCGMG8+ha9cei+wyPfV7KL/Hv1KPvK5Ol+Yu5i9t1x1lxQueYyoTCCnIoiQYyOMtOXwwBJ9EE1u90N0KJr28ZagnttLCN52GtofK5i2MEiFHQrD34W4u4vZ4r2eN0eqbPcFCRfBJSiaHLqWYzXnbHQryz2SqhQEcNkxM1wz45RMcnopv2uY0lIIk/Vuloq8zw=='
	};
	var h = null;
	request.post(options, function(err, res, body) {
		//let json = JSON.parse(body);
		console.log(body);
		h = res.headers;
		const options2 = {
			url: 'https://cufs.vulcan.net.pl/default/FS/LS?wa=wsignin1.0&wtrealm=https%3A%2F%2Fuonetplus.vulcan.net.pl%2Fdefault%2FLoginEndpoint.aspx&wctx=https%3A%2F%2Fuonetplus.vulcan.net.pl%2Fdefault%2FLoginEndpoint.aspx',
			headers: h,
			method: 'GET'
		};
		request.get(options2, function(err, res, body) {
			console.log(h)
			console.log(body)
		});
	});
	

    message.channel.send("ok")
}
