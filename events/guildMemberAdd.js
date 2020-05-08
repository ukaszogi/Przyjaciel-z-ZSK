module.exports = (client, member) => {
    const defaultChannel = client.channels.get("469291361531723797");
    defaultChannel.send(`Siemano ${member.user} na serwerze przyjacieli z ZSK.`).catch(console.error);
}
