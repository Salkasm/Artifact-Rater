module.exports = {
	name: 'version',
	description: `Displays the current version of Artifact Rater`,
	args: false,
	execute(message, args) {

		//Returns a nice embed with information
		const Discord = require('discord.js')
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Artifact Rater, a Genshin Impact Discord Bot')
			.setURL('https://genshin.mihoyo.com/en')
			.setAuthor('Artifact Rater 1.3', 'https://img.utdstc.com/icon/9a6/3d0/9a63d0817ee337a44e148854654a88fa144cfc6f2c31bc85f860f4a42c92019f:200', 'https://genshin-impact.fandom.com/wiki/Artifacts/Stats')
			.setDescription(`Artifact Rater is a bot aiding in judging your artifact.`)
			.setThumbnail('https://static.wikia.nocookie.net/gensin-impact/images/2/27/Item_Initiate%27s_Flower.png/revision/latest/scale-to-width-down/256?cb=20210514215057')
			.addFields({
				name: `With much love <3`,
				value: `Version 1.3 'Flower'`
			}, {
				name: '\u200B',
				value: '\u200B'
			}, {
				name: 'Program coding by',
				value: 'Salkasm',
				inline: true
			}, {
				name: 'Credit',
				value: 'genshin-impact.fandom.com for the stats\nocr.space/OCRAPI for the free OCR API',
				inline: true
			}, )
			.setTimestamp()
			.setFooter(`Last updated: 30th of July '21`);

		message.channel.send(exampleEmbed);
	},
};