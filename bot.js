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

if (msg.content.toLowerCase() === 'ping') {
 msg.reply('pong');
 }

if (msg.content.toLowerCase().startsWith("mucha")) {
 msg.reply("rucha karalucha");
 }

if (msg.content.toLowerCase().startsWith("test1")) {
 msg.channel.send(role1g+" ma test w środę");
 }

if (msg.content.toLowerCase().startsWith("test2")) {
 msg.channel.send(role2g+" ma test w środę");

}
if (msg.content.toLowerCase().startsWith("spr1")) {
 msg.channel.send(role1g+databass.Nextone);
 }


if (msg.content.toLowerCase().startsWith("upspr1")) {
 databass.Nextone = fru;
msg.channel.send("zmiana sprawdziannu "+role1g+" na "+fru);
 }

 });


client.login(config.Token);
