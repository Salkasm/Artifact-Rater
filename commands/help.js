module.exports = {
	name: 'help',
	description: `Help command to explain all existing commands.`,
	args: false,
	execute(message, args) {
		const {
			prefix,
		} = require('../config.json');

		function botresponse(specifier) {
			switch (specifier) {
				case `help`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: ' + prefix + 'help\n\nArguments: None\n\nExample: ' + prefix + 'help\n\nExplanation: Haha very funny...```')
					break;

				case `ping`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: ' + prefix + 'ping\n\nArguments: None\n\nExample: ' + prefix + 'ping\n\nExplanation: Check bot responsiveness.```')
					break;

				case `version`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: ' + prefix + 'version\n\nArguments: None\n\nExample: ' + prefix + 'version\n\nExplanation: Summary of bot version and credits.```')
					break;

				case `rate`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: ' + prefix + 'rate\n\nArguments: [ARTIFACT TYPE] [all] and an uploaded image of the substats.\n\nExample 1: ' + prefix + 'rate\nExplanation: Will analyse the substats only determine the amount of rolls per substat along with the quality of the rolls.\n\nExample 2: ' + prefix + 'rate flower\nExplanation: Will additionally analyse the main stat and the set type. Will output which character this artifact can be used on according to predefined builds.\n\nExample 3: ' + prefix + 'rate flower all\nExplanation: Will do the same, however it will ignore the set type (off-piece) and suggest builds according to main stat and substats only.\n\nBelow are 2 examples provided, the first one is for the simplified rating (requires at least 1 substat type and substat value), the second one for the more sophisticated rating (requires at least the mainstat + value, the substats + values and the set type (green name)).\nOnly supports 5 and 4 star substats!```')
					message.channel.send({
						files: ["https://i.gyazo.com/3441fe067ad5241f90ec42efae4fa2db.png"]
					});
					message.channel.send({
						files: ["https://i.gyazo.com/4c357a435f76a3a8b2a0e24ea2f64c49.png"]
					});
					break;

				case `check`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: ' + prefix + 'check\n\nArguments: [STAT] [VALUE]\n\nExample: ' + prefix + 'check ATK% 11.1\n\nExplanation: Will give you a direct rating of 1 stat. Please leave out any "+" and "%" for the value part.\nOnly supports 5 star substats!```')
					break;

				case `profile`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: ' + prefix + 'profile\n\nArguments: [NAME]\n\nExample: ' + prefix + 'profile Ganyu\n\nExplanation: Will display all registered builds for Ganyu, including recommended sets, main stats, substats and weapons! Only ever recommends the BiS on sets, and BiS weapons (always at least one 4-star non-BP weapon).```')
					break;

			}
		}

		message.channel.send('```\nHello traveler, I see RNGsus has not screwed you for once. I will aid you in determining the value of your artifact.```')
		message.channel.send(`Now, what do you need help with today? Below I have given to you all the possible commands I listen to. Please react to the according emote if you need more information on a certain command.\n🆘: help\n🏓: ping\n⭐: version\n👁️: rate\n⚖️: check\n😊: profile`)
		message.react('🆘')
		message.react('🏓')
		message.react('⭐')
		message.react('👁️')
		message.react('⚖️')
		message.react('😊')

		message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '🆘' || reaction.emoji.name == '🏓' || reaction.emoji.name == '⭐' || reaction.emoji.name == '👁️' || reaction.emoji.name == '⚖️' || reaction.emoji.name == '😊'), {
			max: 1,
			time: 180000
		}).then(collected => {
			if (collected.first().emoji.name == '🆘') {
				botresponse('help')
			} else if (collected.first().emoji.name == '🏓') {
				botresponse('ping')
			} else if (collected.first().emoji.name == '⭐') {
				botresponse('version')
			} else if (collected.first().emoji.name == '👁️') {
				botresponse('rate')
			} else if (collected.first().emoji.name == '⚖️') {
				botresponse('check')
			} else if (collected.first().emoji.name == '😊') {
				botresponse('profile')
			}
		}).catch(() => {
			message.channel.send('```\nI have cancelled your request because I did not receive a response within 3 minutes.```');
		})
	},
};