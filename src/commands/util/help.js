const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const { MessageEmbed } = require('discord.js');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands','h'],
			description: 'Displays a list of available commands, or detailed information for a specified command.',
			details: oneLine`
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.
			`,
			examples: ['help', 'help prefix'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the help for?',
					type: 'string',
					default: ''
				}
			]
		});
	}
	// eslint-disable-next-line require-await
	async run(msg, { command }) {
		if(!command) {
			const embed = new MessageEmbed()
			.setAuthor(this.client.user.username, this.client.user.avatarURL())
			.setColor(0x2f3136);
			let cmdCount = 0;
			for(const group of this.client.registry.groups.values()) {
				const owner = this.client.isOwner(msg.author);
				const commands = group.commands.filter(cmd => {
					if(owner) return true;
					if(cmd.ownerOnly || cmd.hidden) return false;
					return true;
				});
				if(!commands.size) continue;
				cmdCount += commands.size;
				embed.addField(`❤ ${group.name}`, commands.map(cmd => `\`${cmd.name}\``).join(', '));
			}
			if(cmdCount === this.client.registry.commands.size) {
				embed.setFooter(`${this.client.registry.commands.size} Commands`);
			} else {
				embed.setFooter(`${msg.author.tag} ${this.client.registry.commands.size} || ${cmdCount} Commands`);
			}
			return msg.say(embed);
		}
		const embad = new MessageEmbed()
            .setTitle(`Command **${command.name}** ${command.guildOnly ? '  (Usable only in servers)' : ''}`)
            .setColor(this.client.config.color)
            .setFooter(msg.author.tag, msg.author.displayAvatarURL())
            .setDescription(stripIndents`
            > Description: ${command.description}${command.details ? `${command.details}` : ''}
            > Format: ${msg.anyUsage(`${command.name} ${command.format || ''}`)}
            > Aliases: ${command.aliases.join(', ') || 'None'}
            > Group: ${command.group.name} (\`${command.groupID}:${command.memberName}\`)
            > NSFW: ${command.nsfw ? 'Yes' : 'No'}`)
			.setTimestamp();
		return msg.say(embad);
	}
};
