module.exports = {
	name: 'ping',
	description: `Simple ping command to check bot's responsiveness.`,
	args: false,
	execute(message, args) {
		message.channel.send('Pong!')
	}
};