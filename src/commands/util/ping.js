const { stripIndent } = require('common-tags');
const Command = require('../base');
const { MessageEmbed } = require('discord.js');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.',
			throttling: {
				usages: 2,
				duration: 10
			}
		});
	}

	async run(msg) {
		const pingMsg = await msg.say('Pinging...');
		let embed = new MessageEmbed()
		.setTitle(`${this.client.user.username} Latency!`)
		.setColor(0x2f3136)
                .setThumbnail(client.user.avatarURL())
		.setDescription(stripIndent`
		🏓 Pong: ${(pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp)}ms.

		${this.client.ws.ping ? `🌐 Api: ${Math.round(this.client.ws.ping)}ms.` : ''}`)
		.setTimestamp()
		.setFooter(`© ${this.client.user.username}`);
		pingMsg.edit(' ', embed);
	}
};
