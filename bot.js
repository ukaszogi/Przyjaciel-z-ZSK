const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./auth.json");
const databass = require("./data.json");
const fs = require('fs')

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
	case "upspr1":
		datajson.Nextone = fru;
		databass.Nextone = fru;
		fs.writeFile("./data.json", JSON.stringify(datajson), (err) => {
    			if (err) console.error(err)
  		});
		msg.channel.send("zmiana sprawdziannu na "+fru);
		break;
	case "upspr2":
		datajson.Nextone = fru;
		databass.Nextone = fru;
		fs.writeFile("./data.json", JSON.stringify(datajson), (err) => {
    			if (err) console.error(err)
  		});
		msg.channel.send("zmiana sprawdziannu na "+fru);
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