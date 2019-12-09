module.exports = (client, message) => {
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
