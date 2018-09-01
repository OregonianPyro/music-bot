module.exports.run = async (client, message, args) => {
    if (!message.member.voiceChannel) return message.channel.send(`${message.author} | You must be in a voice channel to run this command.`);
    if (!client.playlists.has(message.guild.id)) return message.channel.send(`${message.author} | There is no song playing.`);
    if (!client.playlists.get(message.guild.id).dispatcher.paused) return message.channel.send(`${message.author} | The queue is not paused.`);
    client.playlists.get(message.guild.id).dispatcher.resume();
    message.guild.members.get(client.user.id).setMute(false);
    return message.channel.send(`${message.author} | Successfully resumed the queue.`);
};

module.exports.conf = {
    enabled: true,
    reason: false,
    aliases: []
};

module.exports.help = {
    name: 'resume',
    description: 'Resumes the queue.',
    usage: 'm!resume'
};