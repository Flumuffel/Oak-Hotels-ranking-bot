// this code was given to me by 1988_YumChocolate from the ROBLOX API Server, all credits (as far as I know) go to him
const roblox = require('noblox.js')
const Discord = require('discord.js')
const client = new Discord.Client();
var token = process.env.id;

client.login(token)

var cookie = process.env.cookie;

var prefix = 'o!';
var groupId = 4560058;
var maximumRank = 250;

function login() {
    return roblox.cookieLogin(cookie);
}

login() // Log into ROBLOX
    .then(function() { // After the function has been executed
        console.log('Logged in.') // Log to the console that we've logged in
    })
    .catch(function(error) { // This is a catch in the case that there's an error. Not using this will result in an unhandled rejection error.
        console.log(`Login error: ${error}`) // Log the error to console if there is one.
    });
 
function isCommand(command, message){
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}
 
client.on('message', (message) => {
    if (message.author.bot) return; // Dont answer yourself.
    var args = message.content.split(/[ ]+/)
   
    if(isCommand('setrank', message)){
       if(!message.member.roles.some(r=>["Ranking Permissions"].includes(r.name)) ) // OPTIONAL - Checks if the sender has the specified roles to carry on further
        return message.reply("You don't have the permission to use the Rank System.");
        var username = args[1]
        var rankIdentifier = Number(args[2]) ? Number(args[2]) : args[2];
        if (!rankIdentifier) return message.channel.send("Please enter a rank");
        if (username){
            message.channel.send(`Checking ROBLOX for ${username}`)
            roblox.getIdFromUsername(username)
            .then(function(id){
                roblox.getRankInGroup(groupId, id)
                .then(function(rank){
                    if(maximumRank <= rank){
                        message.channel.send(`${id} is rank ${rank} and not promotable.`)
                    } else {
                        message.channel.send(`${id} is rank ${rank} and promotable.`)
                        roblox.setRank(groupId, id, rankIdentifier)
                        .then(function(newRole){
                            message.channel.send(`Changed rank to ${newRole.Name}`)
                        }).catch(function(err){
                            console.error(err)
                            message.channel.send("Failed to change rank.")
                        });
                    }
                }).catch(function(err){
                    message.channel.send("Couldn't get that player in the group.")
                });
            }).catch(function(err){
                message.channel.send(`Sorry, but ${username} doesn't exist on ROBLOX.`)
           });
       } else {
           message.channel.send("Please enter a username.")
       }
       return;
   }
})
