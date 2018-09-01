const { RichEmbed } = require('discord.js');
const { parse } = require('url');

module.exports.run = async (client, message, args) => {
    let firstSong;
    if (!args[0]) return message.channel.send(`${message.author} | Please provide a song name or search term.`);
    const voice_channel = message.member.voiceChannel;
    if (!voice_channel) return message.channel.send(`${message.author} | You must be in a voice channel to run this command.`);
    if (!client.playlists.has(message.guild.id)) {
        firstSong = true;
        client.playlists.set(message.guild.id, {
            dispatcher: null,
            songs: [],
            connection: null,
            position: -1
        });
        await voice_channel.join();
    };

    let id = (() => {
        const parsed = parse(args.join(' '), true);
        if (/^(www\.)?youtube\.com/.test(parsed.hostname)) {
            return parsed.query.v;
        } else if (/^(www\.)?youtu\.be/.test(parsed.hostname)) {
            return parsed.pathname.slice(1);
        };
    })();

    if (!id) {
        const results = await client.YouTube.searchVideos(args.join(' '), 4);
        id = results[0].id;
    };
    
    let info;
    try {
        info = await client.YouTube.getVideoByID(id);
    } catch (e) {
        return message.channel.send(`:no_entry: **Error** | \`${e.message}\``);
    };
    
    if (parseInt(info.durationSeconds) > 900) return message.channel.send(`${message.author} | Songs cannot be longer than 15 minutes.`);
    const time = parseInt(info.durationSeconds, 10);
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) seconds = `0${seconds}`;
    client.playlists.get(message.guild.id).songs.push({
        url: `https://www.youtube.com/watch?v=${info.id}`,
        id: info.id,
        channName: info.channel.title,
        songTitle: info.title,
        playTime: `${minutes}:${seconds}`,
        playTimeSeconds: info.durationSeconds,
        requester: message.author.tag,
        requesterIcon: message.author.displayAvatarURL
    });
    if (firstSong) {
        client.play_next(message);
    } else {
       const embed = new RichEmbed()
            .setColor('RED')
            .setDescription(`Successfully added the song \`${info.title}\` to the queue.\n\nDuration: ${minutes}:${seconds}`)
            .setAuthor(info.title, `https://i.ytimg.com/vi/${info.id}/mqdefault.jpg`, `https://www.youtube.com/watch?v=${info.id}`)
            .setFooter(`Requested by ${message.author.tag}}`, message.author.displayAvatarURL)
            .setImage(`https://i.ytimg.com/vi/${info.id}/mqdefault.jpg`)
            .setTimestamp()
            .setURL(`https://www.youtube.com/watch?v=${info.id}`);
        return message.channel.send(embed);
    };
};

module.exports.conf = {
    enabled: true,
    reason: false,
    aliases: []
};

module.exports.help = {
    name: 'play',
    description: 'Adds a song to the server queue.',
    usage: 'm!play <search term>',
};