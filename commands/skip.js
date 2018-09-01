module.exports.run = async (client, message, args) => {
    if (!client.playlists.has(message.guild.id)) return message.channel.send(`${message.author} | There are no songs playing.`);
    if (!message.member.voiceChannel) return message.channel.send(`${message.author} | You must be in a voice channel to run this command.`);
    const users = Math.floor(message.member.voiceChannel.members.filter(m => m.user.id !== client.user.id).size * 2 / 3);
    if (users < 2) {
        message.channel.send(`${message.author} | Skipping song.`);
        return client.playlists.get(message.guild.id).dispatcher.end('skip');
    };

    message.channel.send(`More than two users in the voice channel - you need ${users} votes to skip the song.\n\nTo skip, simply type \`skip\`. This will timeout in 15 seconds.`);

    const filter = (m) => m.content.toLowerCase() === 'skip';
    message.channel.awaitMessages(filter, {
        'errors': ['time'],
        'max': users,
        time: 15000
    }).then(collected => {
        if (collected.size > users) return message.channel.send("Skipping song...").then(() => {
            client.playlists.get(message.guild.id).dispatcher.end('skip');
        });
    }).catch(collected => {
        if (collected.size === 0) {
            return message.channel.send(':no_entry: **Not Skipping** | No one voted.');
        }
        message.channel.send(`:no_entry: **Not Skipping** | Only ${collected.size} out of ${users} voted before the time ran out.`);
    }); 
};

module.exports.conf = {
    enabled: true,
    reason: false,
    aliases: []
};

module.exports.help = {
    name: 'skip',
    description: 'Skips the current song.',
    usage: 'm!skip'
};