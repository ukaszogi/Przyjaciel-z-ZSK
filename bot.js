const Discord = require('discord.js');
 const client = new Discord.Client();

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {
 if (msg.content === 'ping') {
 msg.reply('pong');
 }
 });


client.login ("NjQ5MjgwMTE1NTY1Mzk1OTk4.Xd6flQ.V-WpoCOL7IjecYvvpmveUtft7ko");
