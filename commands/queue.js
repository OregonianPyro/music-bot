const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    console.log('ran');
    if (!client.playlists.has(message.guild.id)) return message.channel.send(`${message.author} | The queue is empty.`);
    let playlist = client.playlists.get(message.guild.id);
    playlist = playlist.songs.slice(playlist.position);
    const current = playlist.shift();
    const singular = playlist.length === 1;
    const embed = new RichEmbed()
        .setColor('RED')
        .setDescription(`> Currently Playing: **${current.songTitle.substring(0, 50)}**\n\nThere ${singular === 1 ? 'is' : 'are'} song${singular ? '' : 's'} in the queue.`)
        .setThumbnail(`https://i.ytimg.com/vi/${current.id}/mqdefault.jpg`);
     for (let i = 0; i < playlist.length && i < 5; i++) {
      embed.addField(`🎧 ${playlist[i].songTitle.substring(0, 50)} (${playlist[i].playTime})`, `🤘 Requested by **${playlist[i].requester}**`);
    };
    return message.channel.send(embed);
};

module.exports.conf = {
    enabled: true,
    reason: false,
    aliases: ['q', 'playlist']
};

module.exports.help = {
    name: 'queue',
    description: 'Displays the current songs in the queue.',
    usage: 'm!queue'
};