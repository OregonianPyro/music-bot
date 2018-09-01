module.exports.run = async (client, message, args) => {
    if (!message.member.voiceChannel) return message.channel.send(`${message.author} | You must be in a voice channel to run this command.`);
    if (!client.playlists.has(message.guild.id)) return message.channel.send(`${message.author} | There is no song playing.`);
    if (client.playlists.get(message.guild.id).dispatcher.paused) return message.channel.send(`${message.author} | The queue is already paused.`);
    client.playlists.get(message.guild.id).dispatcher.pause();
    message.guild.members.get(client.user.id).setMute(true);
    return message.channel.send(`${message.author} | Successfully paused the queue.`);
};

module.exports.conf = {
    enabled: true,
    reason: false,
    aliases: []
};

module.exports.help = {
    name: 'pause',
    description: 'Pauses the queue.',
    usage: 'm!pause'
};