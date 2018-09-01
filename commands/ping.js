module.exports.run = async (client, message, args) => {
    return message.channel.send(`${message.author} | My ping is: \`${client.ping.toFixed()}ms\``);
};

module.exports.conf = {
    enabled: true,
    reason: false,
    aliases: []
};

module.exports.help = {
    name: 'ping',
    description: 'Pings...the..bot',
    usage: 'm!ping'
};