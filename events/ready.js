module.exports = (client) => {
    console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
    //set custom status
    client.user.setPresence({
        status: "online",
        game: {
            name: "z przyjaciółmi z ZSK",
            type: "PLAYING" //PLAYING or WATCHING or LISTENING or STREAMING
        }
    });
}
