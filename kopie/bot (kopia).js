/*
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
	if(msg.author.bot) return;

	const args = msg.content.trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	let role1g = msg.guild.roles.find(role => role.name === "1g");
	let role2g = msg.guild.roles.find(role => role.name === "2g");
	let role1gs = msg.guild.roles.find(role => role.name === "1gs");
	let role2gs = msg.guild.roles.find(role => role.name === "2gs");
	let rolegejm = msg.guild.roles.find(role => role.name === "Gejm Deweloperz");
	let fru = msg.content.replace(msg.content.trim().split(/ +/g).shift(),"").trim();
	let datajson = JSON.parse(fs.readFileSync("./data.json", "utf8"));

	if (czyodp==1){
		if (command=="tak") {msg.channel.send("@1g macie sprawdzian z "+databass.Nextone); czyodp=0;}
		else if (command=="nie") {msg.channel.send("pewnie zapomną :("); czyodp=0;}
	}
	if (czyodp==2){
		if (command=="tak") {msg.channel.send("@2g macie sprawdzian z "+databass.Nextone); czyodp=0;}
		else if (command=="nie") {msg.channel.send("pewnie zapomną :("); czyodp=0;}
	}


	switch (command) {
		case "ping":
			msg.reply('pong');
			break;
		case "mucha":
			msg.channel.send("rucha karalucha");
			break;
		case "test1":
			msg.channel.send(" ma test w środę");
			break;
		case "test2":
			msg.channel.send(" ma test w środę");
			break;
		case "spr1":
			msg.channel.send(databass.Nextone);
			break;
		case "spr2":
			msg.channel.send(databass.Nexttwo);
			break;
		case "powiadomienie-1":
			msg.member.addRole(role1g).catch(console.error)
			msg.channel.send("będziesz otrzymywać powiadomienia! :)");
			msg.member.removeRole(role1gs).catch(console.error)
			break;
		case "powiadomienie-2":
			msg.member.addRole(role2g).catch(console.error)
			msg.channel.send("będziesz otrzymywać powiadomienia! :)");
			msg.member.removeRole(role2gs).catch(console.error)
			break;
		case "nie-chce-powiadomien-1":
			if(msg.member.roles.has(role1g.id)) {
				msg.member.addRole(role1gs).catch(console.error)
				msg.channel.send("przypisano rolę bez powiadomień! :)");
				msg.member.removeRole(role1g).catch(console.error)
			} else {
				msg.channel.send("nie dostajesz powiadomień");
			}
			break;
		case "nie-chce-powiadomien-2":
			if(msg.member.roles.has(role2g.id)) {
				msg.member.addRole(role2gs).catch(console.error)
				msg.channel.send("przypisano rolę bez powiadomień! :)");
				msg.member.removeRole(role2g).catch(console.error)
			} else {
				msg.channel.send("nie dostajesz powiadomień");
			}
			break;
		case "upspr1":
			datajson.Nextone = fru;
			databass.Nextone = fru;
			fs.writeFile("./data.json", JSON.stringify(datajson), (err) => {
	    			if (err) console.error(err)
	  		});
			msg.channel.send("zmiana sprawdziannu na "+fru+"\nczy powiadomić grupę o tym?");
			czyodp=1;
			break;
		case "upspr2":
			datajson.Nextone = fru;
			databass.Nextone = fru;
			fs.writeFile("./data.json", JSON.stringify(datajson), (err) => {
	    			if (err) console.error(err)
	  		});
			msg.channel.send("zmiana sprawdziannu na "+fru+"\nczy powiadomić grupę o tym?");
			czyodp=2;
			break;
		case "powiedz":
			let text = args.join(" ");
			msg.delete();
			msg.channel.send(text);
			break;
		case "penis":
		case "kutas":
			msg.channel.send("chodzi o kutasa ?");
			break;
		case "elo":
			msg.channel.send("siema");
			break;
		case "twoja":
			if (args[0]=="stara") msg.channel.send("nie bo twoja");
			break;
		case "ok":
			if (args[0]=="boomer") msg.channel.send("shut up you zoomer");
			break;
		case "los":
			if (args[0]!=null&&Number.isInteger(Math.floor(Math.random()*args[0])))
				msg.channel.send(Math.floor(Math.random()*args[0]));
			else msg.channel.send("wpisz liczbe np. los 100");
			break;
		case "mam-duzego?":
			if (Math.floor(Math.random()*2)==0) msg.channel.send("tak");
			else msg.channel.send("nie");
			break;
		case "mam-malego?":
			if (Math.floor(Math.random()*2)==0) msg.channel.send("tak");
			else msg.channel.send("nie");
			break;
		case "sex":
		case "big-butts":
		case "nsfw":
			msg.channel.send("( ͡° ͜ʖ ͡°)");
			break;
		case "gejm":
			if (message.author.id !== '340604514820161536') return;
			else {
				msg.member.addRole(rolegejm).catch(console.error)
				msg.channel.send("ok");
			}
			break;
		case "kasza":
			if (msg.author.id=="340604514820161536")
				msg.channel.send("<@493080797943955476> ty cieniasie");
			else msg.reply(" jesteś cieniasem")
			break;
	}
});


client.login(config.Token);
*\
