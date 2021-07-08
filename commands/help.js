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
					message.channel.send('```\n<Documentation>\n\nCommand: '+ prefix +'help\n\nArguments: None\n\nExample: '+ prefix +'help\n\nExplanation: Haha very funny...```')
					break;

				case `ping`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: '+ prefix +'ping\n\nArguments: None\n\nExample: '+ prefix +'ping\n\nExplanation: Check bot responsiveness.```')
					break;

				case `version`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: '+ prefix +'version\n\nArguments: None\n\nExample: '+ prefix +'version\n\nExplanation: Summary of bot version and credits.```')
					break;

				case `ocr`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: '+ prefix +'ocr\n\nArguments: Uploaded image of substats\n\nExample: '+ prefix +'ocr\n\nExplanation: When uploading a image with substats, type "'+ prefix +'ocr" as a comment. An external program will analyse the image and the bot will calculate the rating.```')
					break;

				case `rate`:
					message.channel.send('--------------------------------------')
					message.channel.send('```\n<Documentation>\n\nCommand: ;rate\n\nArguments: [STAT] [VALUE]\n\nExample: ;rate ATK% 11.1\n\nExplanation: Will give you a direct rating of 1 stat. Please leave out any "+" and "%" for the value part.```')
					break;

			}
		}

		message.channel.send('```\nHello traveler, I see RNGsus has not screwed you for once. I will aid you in determining the value of your artifact.```')
		message.channel.send(`Now, what do you need help with today? Below I have given to you all the possible commands I listen to. Please react to the according emote if you need more information on a certain command.\n🆘: help\n🏓: ping\n⭐: version\n👁️: ocr\n⚖️: rate`)
		message.react('🆘')
		message.react('🏓')
		message.react('⭐')
		message.react('👁️')
		message.react('⚖️')

		message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '🆘' || reaction.emoji.name == '🏓' || reaction.emoji.name == '⭐' || reaction.emoji.name == '👁️' || reaction.emoji.name == '⚖️'), {
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
				botresponse('ocr')
			} else if (collected.first().emoji.name == '⚖️') {
				botresponse('rate')
			}
		}).catch(() => {
			message.channel.send('```\nI have cancelled your request because I did not receive a response within 3 minutes.```');
		})
	},
};