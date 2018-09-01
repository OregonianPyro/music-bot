module.exports.run = async (client, message, args) => {
    if (!client.playlists.has(message.guild.id)) return message.channel.send(`${message.author} | There are no songs playing.`);
    if (!message.member.voiceChannel) return message.channel.send(`${message.author} | You must be in a voice channel to run this command.`);
    if (!args[0]) return message.channel.send(`${message.author} | Current volume is set at ${client.playlists.get(message.guild.id).dispatcher.volume * 100}%`);
    const volume = args[0].includes('%') ? args[0].split('%')[0] : args[0];
    if (isNaN(parseInt(volume))) return message.channel.send(`${message.author} | Provided argument was not a number.`);
    if (volume < 0 || volume > 100) return message.channel.send(`${message.author} | Value must be between \`0\` and \`100\``);
    message.guild.voiceConnection.volume = volume / 100;
    client.playlists.get(message.guild.id).dispatcher.setVolume(volume / 100);
    return message.channel.send(`${message.author} | Set the volume to ${client.playlists.get(message.guild.id).dispatcher.volume * 100}%`);
};

module.exports.conf = {
    enabled: true,
    reason: false,
    aliases: ['vol']
};

module.exports.help = {
    name: 'volume',
    description: 'Sets the volume for the music playing.',
    usage: 'm!volume <volume>'
};