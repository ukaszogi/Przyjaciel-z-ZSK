module.exports = (client) => {
    console.log(`Gotowy do działania na ${client.guilds.size} serwerach, ${client.channels.size} kanałach, dla  ${client.users.size} ludzików.`);

    //set custom status
    client.user.setPresence({
        status: "online",
        game: {
            name: "ZSK TV",
            type: "WATCHING" //PLAYING or WATCHING or LISTENING or STREAMING
        }
    });
}
