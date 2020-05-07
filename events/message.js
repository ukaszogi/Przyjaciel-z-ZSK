module.exports = (client, message) => {
  function parseAsterisk(text) {
        if (text.endsWith("*") && text.startsWith("*")) {
            return parseAsterisk(text.substr(1, text.length - 2));
        } else {
            return text;
        }
    }

    message.content = parseAsterisk(message.content);
    
    if (!isNaN(message.content) && message.author.id !== client.user.id && message.attachments.size == 0 && (message.channel.id === "689472410709524493" || message.channel.id === "651402884625465344"))  {
        let num = parseInt(message.content)
        if (num % 2 === 0) return;

        let tosend = num + 1;

        if (tosend % 1000 === 420) {
            tosend = "**" + tosend + "**";
        }
        message.channel.send(tosend);
    }
  if (message.author.bot) return;
  //if (message.content.indexOf(client.config.prefix) !== 0) return;

  const args = message.content/*.slice(client.config.prefix.length)*/.trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);
  if (!cmd) return;

//Taki kod z stackoverflowa jak się chce odpowiedzieć od razu
/*if (command === 'spec'){
        message.author.send("See or Change?");
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        console.log(collector)
        collector.on('collect', message => {
            if (message.content === "See") {
                message.channel.send("You Want To See Someones Spec OK!");
            } else if (message.content === "Change") {
                message.channel.send("You Want To Change Your Spec OK!");
            }
        })*/

  cmd.run(client, message, args);
};
