const { RichEmbed } = require('discord.js');

module.exports = async (message) => {
    const playlist = message.client.playlists.get(message.guild.id);
    const next_song = playlist.songs[++playlist.position];
    const dispatcher = message.guild.voiceConnection.playStream(message.client.ytdl(next_song.url, { quality: "lowest", filter: "audioonly" }), { passes: 3, volume: message.guild.voiceConnection.volume || 0.2 });
    playlist.dispatcher = dispatcher;
    const embed = new RichEmbed()
        .setTitle(`Now playing **${next_song.songTitle}** (${next_song.playTime})`)
        .setColor('RED')
        .setFooter(`Requested by ${next_song.requester}`, next_song.requesterIcon)
        .setImage(`https://i.ytimg.com/vi/${next_song.id}/mqdefault.jpg`)
        .setTimestamp()
        .setURL(next_song.url);
    message.channel.send(embed);
    dispatcher.on("end", () => {
        if (playlist.position + 1 < playlist.queue.length) {
            message.client.play_next(message);
        } else {
            message.channel.send('No more songs in the queue.');
            message.guild.voiceConnection.disconnect();
            message.client.playlists.delete(message.guild.id);
        };
    });
};