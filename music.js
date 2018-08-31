const { Client, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const yt_api = require('simple-youtube-api');

class Music extends Client {
    constructor(options) {
        super(options)
        this.YouTube = new yt_api(process.env.YT_API);
        this.ytdl = require('ytdl-core');
        this.chalk = require('chalk');
        this.moment = require('moment');
        this.commands = new Collection();
        this.aliases = new Collection();
        this.playlists = new Collection();
        this.play_next = require('./functions/play_next.js');
    };
};

const client = new Music();
fs.readdir('./commands/', (err, files) => {
    if (err) console.error(err.stack);
    files.forEach(f => {
        const props = require(`./commands/${f}`);
        console.log(client.chalk.bgGreen(`Loaded command '${props.help.name}'`));
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(a => {
            client.aliases.set(a, props.help.name);
        });
    });
});

client.on('ready', () => console.log(client.chalk.bgBlack.green(`${client.user.tag} is now online.`)));
client.on('error', (error) => console.error(error));
client.on('message', async (message) => {
    if (message.content.indexOf('m!') !== 0) return;
    const args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0];
    command = command.slice(2).toLowerCase();
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    };
    if (cmd) {
        try {
            await cmd.run(client, message, args);
        } catch (e) {
            return message.channel.send(`:no_entry: **Error** | \`${e.message}\``), console.error(e.stack);
        };
    };
});

client.login(process.env.TOKEN);

process.on('unhandledRejection', error => {
    console.error(`Uncaught Promise Error: \n${error.stack}`);
});