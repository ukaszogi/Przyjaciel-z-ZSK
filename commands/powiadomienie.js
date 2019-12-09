exports.run = (client, message, args) => {

	let role1g = message.guild.roles.find(role => role.name === "1g");
	let role2g = message.guild.roles.find(role => role.name === "2g");
	let role1gs = message.guild.roles.find(role => role.name === "1gs");
	let role2gs = message.guild.roles.find(role => role.name === "2gs");

	if (args[0]=="nie") {
		if (args[1]=="1") {
		   	message.member.addRole(role1gs).catch(console.error)
			message.channel.send("nie będziesz otrzymywać już powiadomień! :)");
			message.member.removeRole(role1g).catch(console.error)
		}
		else if (args[1]=="2") {
			message.member.addRole(role2gs).catch(console.error)
			message.channel.send("nie będziesz otrzymywać już powiadomień! :)");
			message.member.removeRole(role2g).catch(console.error)
		}
	} 
	else if (args[0]=="1") {
	   	message.member.addRole(role1g).catch(console.error)
		message.channel.send("będziesz otrzymywać powiadomienia! :)");
		message.member.removeRole(role1gs).catch(console.error)
	}
	else if (args[0]=="2") {
		message.member.addRole(role2g).catch(console.error)
		message.channel.send("będziesz otrzymywać powiadomienia! :)");
		message.member.removeRole(role2gs).catch(console.error)
	}
}
