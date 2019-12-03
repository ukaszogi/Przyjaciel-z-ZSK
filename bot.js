const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./auth.json");
const databass = require("./data.json");
const fs = require('fs')

var czyodp = 0;

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });


client.on('message', msg => {

const args = msg.content.trim().split(/ +/g);
const command = args.shift().toLowerCase();
let role1g = msg.guild.roles.find(role => role.name === "1g");
let role2g = msg.guild.roles.find(role => role.name === "2g");
let fru = msg.content.replace(command,"").trim();
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
		msg.channel.send(/*/role1g+/*/" ma test w środę");
		break;
	case "test2":
		msg.channel.send(/*/role2g+/*/" ma test w środę");
		break;
	case "spr1":
		msg.channel.send(/*/role1g+/*/databass.Nextone);
		break;
	case "spr2":
		msg.channel.send(/*/role2g+/*/databass.Nexttwo);
		break;
	case "powiadomienie-1":
		msg.member.addRole(role1g).catch(console.error)
		msg.channel.send("dodano rolę! :)");
		break;
	case "powiadomienie-2":
		msg.member.addRole(role2g).catch(console.error)
		msg.channel.send("dodano rolę! :)");
		break;
	case "nie-chce-powiadomień":
		if(msg.member.roles.some(r=>["1g","2g"].includes(r.name)) ) {
			msg.member.removeRole(role1g).catch(console.error);
			msg.member.removeRole(role2g).catch(console.error);
			msg.channel.send("usunięto rolę! :)");
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
	case "stop":
		client.logout();
}

 });


client.login(config.Token);
