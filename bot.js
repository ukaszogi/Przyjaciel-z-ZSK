const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./auth.json");
const databass = require("./data.json");

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });


client.on('message', msg => {

const args = msg.content.trim().split(/ +/g);
const command = args.shift().toLowerCase();
let role1g = msg.guild.roles.find(role => role.name === "1g");
let role2g = msg.guild.roles.find(role => role.name === "2g");
let fru = msg.content.replace(command,"").trim();

switch (command) {
	case 'ping':
		msg.reply('pong');
	case 'mucha':
		msg.channel.send("rucha karalucha");
	case 'test1':
		msg.channel.send(role1g+" ma test w środę");
	case 'test2':
		msg.channel.send(role2g+" ma test w środę");
	case 'spr1':
		msg.channel.send(role1g+databass.Nextone);
	case 'upspr1':
		databass.Nextone = fru;
		msg.channel.send("zmiana sprawdziannu "+role1g+" na "+fru);
	case 'powiedz':
		let text = args.join(" ");
		msg.delete();
		msg.channel.send(text);
}

 });


client.login(config.Token);
