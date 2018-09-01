module.exports.run = async (client, message, args) => {
    if (!args[0]) {
        let sandbox = [];
        client.commands.forEach(cmd => {
            if (cmd.help.name === 'eval' || cmd.help.name === 'reload') return;
            sandbox.push(`m!${cmd.help.name} :: ${cmd.help.description}`);
        });
        return message.channel.send(`= Command List =\n[ use m!help <comamnd> for help on a command ]\n\n${sandbox.join('\n')}`, { code: 'asciidoc' });
    } else {
        const command = args[0].toLowerCase();
        const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        if (!cmd) return;
        return message.channel.send(`= ${cmd.help.name} =\n${cmd.help.description}\n============================\nUsage:: ${cmd.help.usage}\nAliases:: ${cmd.conf.aliases.length > 0 ? `[${cmd.conf.aliases.join(', ')}]` : 'No Aliases'}`, { code: 'asciidoc' })
    };
};

module.exports.conf = {
    enabled: true,
    reason: null,
    aliases: []
};

module.exports.help = {
    name: 'help',
    description: 'View the bot\'s commands, or get help on a command.',
    usage: 'm!help <command>'
};