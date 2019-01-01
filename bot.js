// this code was given to me by 1988_YumChocolate from the ROBLOX API Server, all credits (as far as I know) go to him
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const roblox = require('noblox.js')
const Discord = require('discord.js')
const client = new Discord.Client();
var token = "NTI5MDgxNzgwODUxMTc5NTQ3.DwuVXw.4WFK1KWszYPU9m8n_iC3a9GzGzI";

client.login(token)

var cookie = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_6076493B6DC790B1A5EAD37B39A199C05B693FA7556721EA0F5A481E9968CB1E47F64B7CB31CBAEE26E2C8F9469DF3A430BE2BFFCA633AC85B7764DF556EF4AE6D9C1B2D5E326D2477D808757F6194DDA71D7BA7CB2C228B14EBBF9F64276358737651300C93C9530359C91B60EC106AC4042923BEBA41BED9CA2E11B392A611C56ED4FB4408C4536DDAA060B8AA4BDDF9329ED0AEC5E21050FFB9DAEB079E2039192E74D3B53572BECB19621A87579EDF6AAC1F7287A9D33C47F37ECEB218FED14A13E30103EAAFA94DDBEF43E847E6DE46BEB24E267CAE3D8DCA1681D48D47A7809BD5445DBB8D8BCE80B5D50431E0507B585E09A05B23B52A58AA25AD7CBF667F97E1AF418230673A15A95627A211F42FC86723925BE86011712BBE43831FC395219C";

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
