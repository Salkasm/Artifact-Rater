const fs = require('fs');
const fetch = require("node-fetch");
const Discord = require('discord.js');
const {
    prefix,
    token,
} = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

//Setup for commands

client.on('message', message => {
    //if (message.channel.type === 'dm') return //DM IS ALLOWED
    if (!message.content.startsWith(prefix)) return;

    let args = message.content.substring(prefix.length).split(" ");
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    if (command.args && !args.length) {
        return message.channel.send('```\n' + `You didn't provide any arguments!` + '```');
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('```\n' + 'The command does not exist!' + '```');
    }

});

client.login(token);