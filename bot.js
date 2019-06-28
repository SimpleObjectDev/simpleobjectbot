const config ={
  "prefix": "so!",
  "token": "NTU0NDAwOTQ2NDc4OTA3Mzky.D2cLCg.txsuNvJRsorh4hn3L_LiC-YnJnE",
  "devIDs": ["296750415964274689", "440076378046595083", "231956829159161856"],
  "adminRole": "554254211936813075",
  "modRole": "554254217427288065",
  "website": "https://simpleobject.tk"
}

const { Client, Util } = require('discord.js');
const bot = new Client();
const Discord = require(`discord.js`)

bot.on('ready', async () => {
  bot.user.setStatus('dnd')
  bot.user.setActivity(`${config.website} || ${config.prefix}help`, { type: "WATCHING" })
  console.log(`${bot.users.get("554400946478907392").tag} by ${bot.users.get("296750415964274689").tag} has started successfully!`)
})

bot.on('message', async (msg) => {
  if(msg.author.bot) return;
  if(!msg.content.startsWith("so!")) return;
  if(!commands.hasOwnProperty(msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0])) { msg.channel.send("Command not found on server.") }
  if(commands.hasOwnProperty(msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0]](msg);
})

bot.on('guildMemberAdd', async (user) => {
  bot.guilds.get("553584601486852096").channels.get("554254270724046850").send(`Welcome to SimpleObject ${user} (${user.id}) please read <#554254267741896705>.`)
})

bot.on('guildMemberRemove', async (user) => {
  bot.guilds.get("553584601486852096").channels.get("554254270724046850").send(`${user} (${user.id}) has left the server.`)
})

bot.login(config.token)

const commands = {
  'eval': async (msg) => {
      let embed = new Discord.RichEmbed()
      let token = config.discordToken
      let args = msg.content.split(' ').slice(1)

      if (msg.author.id !== "296750415964274689") { return msg.channel.send(':no_entry_sign: │ Only my developer can use this!') }
      try {

          let result = await eval(args.join(' '))
          if (result === "NDE4ODEzNjY3NDUxMzM4NzYy.DvBbiQ.aJBKVWIsPedfhSqJsE4uEf0GWbo") { return msg.channel.send("No token 4 u!") }
          if (result.length > 2000) {
              uploadToHastebin(result).then((url) => {
                  msg.channel.send(':outbox_tray:   **»**   ' + url)
              }).catch((error) => {
                  msg.channel.send(':exclamation:   **»**   Failed to upload result to hastebin. `' + error.msg + '`')
              })
          } else {
              embed.setTitle("Eval command").addField('Code:', `\`\`\`js\n${args.join(' ')}\n\`\`\``).addField('Result:', `\`\`\`js\n${result}\n\`\`\``).setColor("PURPLE")

              msg.channel.send(embed)
          }
      } catch (e) {
          embed.setTitle("You oofed...").setColor("RED").setDescription("There was a problem while executing!").addField('Error:', `\`\`\`js\n${e}\n\`\`\``)
          msg.channel.send(embed)
      }
  },
  'help': (msg) => {
    let embed = new Discord.RichEmbed()
    .setColor("PURPLE")
    .setTitle("Help command.")
    .setDescription("These are the commands avaliable for usage.")
    .addField("Public commands", "say - say's the provided message.\nhelp - gives all the avaliable commands.\nwebsite - give's you our website.\nkick - kicks the user provided.\nban - bans the user provided.\nstats - gives you the bots statistics.\npurge - deletes the provided ammount of messages.")
    msg.channel.send(embed)
  },
  'say': (msg) => {
    let args = msg.content.split(" ").slice(1).join(' ')
    let embed = new Discord.RichEmbed()
    .setColor("PURPLE")
    .setDescription(args)
    .setFooter(`Sent by ${msg.author.tag}`)
    msg.channel.send(embed)
  },
  'website': (msg) => {
    msg.channel.send(config.website)
  },
  'purge': (msg) => {
    if(!msg.member.hasPermission('MANAGE_MESSAGES')) {return msg.channel.send("You do not have permission to use this command.")}
    let args = msg.content.split(" ").slice(1).join(' ')
    if(!args) {return msg.channel.send("You didn't tell me an ammount of messages to delete.")}
    if (isNaN(args)) {return msg.channel.send("The ammount of message you provide must be a number!")}
    msg.channel.bulkDelete(args)
    msg.channel.send("Successfully deleted " + args + " messages!")
  },
  'kick': (msg) => {
    if(!msg.member.hasPermission('KICK_MEMBERS')) {return msg.channel.send("You do not have permission to use this command.")}
    let member = msg.mentions.members.first()
    if(!member) {return msg.channel.send("You didn't provide me a member to kick.")}
    let reason = msg.content.split(" ").slice(2).join(' ')
    if(!reason) {return msg.channel.send("You didn't tell me a reason to kick that user.")}
    msg.channel.send(`Successfully kicked ${member}`)
    member.kick(reason)
  },
  'ban': (msg) => {
    if(!msg.member.hasPermission('BAN_MEMBERS')) {return msg.channel.send("You do not have permission to use this command.")}
    let member = msg.mentions.members.first()
    if(!member) {return msg.channel.send("You didn't provide me a member to ban.")}
    let reason = msg.content.split(" ").slice(2).join(' ')
    if(!reason) {return msg.channel.send("You didn't tell me a reason to ban that user.")}
    msg.channel.send(`Successfully banned ${member}`)
    member.ban(reason)
  },
  'stats': (msg) => {
    let embed = new Discord.RichEmbed()
    embed.setColor("#4B0082")
        .setTitle("Bots statistics!")
        .addField("Memory Used :floppy_disk:", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField("Users :person_with_blond_hair:", `${bot.users.size.toLocaleString()}`, true)
        .addField("Servers", `${bot.guilds.size.toLocaleString()}`, true)
        .addField("Channels", `${bot.channels.size.toLocaleString()}`, true)
        .addField("Prefix :arrow_forward:", `${config.prefix}`, true)
        .addField("Ping :ping_pong:", `${bot.ping.toFixed(2)} ms`, true)
    msg.channel.send({ embed })
  },
}
