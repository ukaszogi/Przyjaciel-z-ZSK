const Discord = require('discord.js');
const client = new Discord.Client();
const config = {
        "Token": process.env.TOKEN,
        "prefix": process.env.PREFIX,
        "pathToDatabase": process.env.PATH_TO_DATABASE,
        "password": process.env.PASSWORD,
        "FirebaseTokenKey": process.env.FIRE_BASE_TOKEN_KEY,
        "ownerIDMat": process.env.OWNER_ID_MAT,
        "ownerIDLuk": process.env.OWNER_ID_LUK
    }
;
const fs = require('fs')
client.config = config;

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Discord.Collection();

const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
files.forEach(file => {
    let command = require(`./commands/${file}`);
    console.log(`Attempting to load command ${command.name}`);
    client.commands.set(command.name, command);
});

/*client.on('messageDelete', async (message) => {
  const logs = message.guild.channels.find(channel => channel.name === "logs");
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    message.guild.createChannel('logs', 'logi');
  }
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
    console.log('kanał z logami nie istnieje. Próbowałem go stwrzyć ale nie mam wystarczających permisji')
  }
  const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first())
  let user = ""
    if (entry.extra.channel.id === message.channel.id
      && (entry.target.id === message.author.id)
      && (entry.createdTimestamp > (Date.now() - 5000))
      && (entry.extra.count >= 1)) {
    user = entry.executor.tag
  } else {
    user = message.author.tag
  }

let DeleteEmbed = new Discord.RichEmbed()
  .setTitle("**DELETED MESSAGE**")
  .setColor("#fc3c3c")
  .addField("Author", user, true)
  .addField("Channel", message.channel, true)
  .addField("Message", message.content)
  .setFooter(`Message ID: ${message.id} | Author ID: ${message.author.id}`);

  logs.send(DeleteEmbed);
})*/

client.login(config.Token);

