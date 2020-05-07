exports.run = (client, message, args) => {
const ytdl = require('ytdl-core');

if (message.author.bot) return;
const streamOptions = { seek: 0, volume: 0.5 };
var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection => {
            console.log("joined channel");
            const stream = ytdl(args[0], { filter : 'audioonly' });
            const dispatcher = connection.playStream(stream, streamOptions);
            dispatcher.on("end", end => {
                console.log("left channel");
                voiceChannel.leave();
            });
        }).catch(err => console.log(err));
}
