module.exports.run = async (client, message, args) => {
    if (!client.playlists.has(message.guild.id)) return message.channel.send(`${message.author} | There is no songs playing.`);
    const voice_channel = message.member.voiceChannel;
    if (!voice_channel) return message.channel.send(`${message.author} | You must be in a voice channel to run this command.`);
    client.playlists.delete(message.guild.id);
    voice_channel.leave();
    return message.channel.send(`${message.author} | Successfully ended the queue and left the voice channel.`);
};

module.exports.conf = {
    enabled: true,
    reason: false,
    aliases: ['end']
};

module.exports.help = {
    name: 'stop',
    description: 'Ends the queue and leaves the voice channel.',
    usage: 'm!stop'
};