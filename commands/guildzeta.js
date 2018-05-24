const Command = require('../base/Command');
const mysql = require('mysql');

class GuildZeta extends Command {
    constructor(client) {
        super(client, {
            name: 'guildzeta',
            category: "SWGoH",
            aliases: ['gz, guildz'],
            permissions: ['EMBED_LINKS']
        });
    }
    async run(client, message, [userID, ...searchChar], level) {
        // Need to get the allycode from the db, then use that
        if (!userID) {
            return message.channel.send(message.language.get('COMMAND_GUILDSEARCH_MISSING_CHAR'));
        }
        if (shipArr.includes(userID) && searchChar.length) {
            ships = true;
            userID = searchChar.splice(0, 1)[0];
        } else if (shipArr.filter(e => searchChar.includes(e)).length > 0) {
            const comp = shipArr.filter(e => searchChar.includes(e));
            ships = true;
            comp.forEach(e => {
                searchChar.splice(searchChar.indexOf(e));
            });
        }
        if (userID === "me") {
            userID = message.author.id;
        } else if (userID.match(/\d{17,18}/)) {
            userID = userID.replace(/[^\d]*/g, '');
        } else {
            // If they're just looking for a character for themselves, get the char
            searchChar = [userID].concat(searchChar);
            userID = message.author.id;
        }
        searchChar = searchChar.join(' ');
        const chars = !ships ? client.findChar(searchChar, client.characters) : client.findChar(searchChar, client.ships);
        let character;
        let charURL;
        if (!searchChar) {
            return message.channel.send(message.language.get('COMMAND_GUILDSEARCH_MISSING_CHAR'));
        } 
        
        if (chars.length === 0) {
            return message.channel.send(message.language.get('COMMAND_GUILDSEARCH_NO_RESULTS', searchChar));
        } else if (chars.length > 1) {
            const charL = [];
            const charS = chars.sort((p, c) => p.name > c.name ? 1 : -1);
            charS.forEach(c => {
                charL.push(c.name);
            });
            return message.channel.send(message.language.get('COMMAND_GUILDSEARCH_CHAR_LIST', charL.join('\n')));
        } else {
            character = chars[0];
            charURL = character.avatarURL;
        }

        const ally = await client.allyCodes.findOne({where: {id: userID}});
        if (!ally) {
            return message.channel.send(message.language.get('BASE_SWGOH_NOT_REG', client.users.get(userID).tag));
        }       
        const allyCode = ally.dataValues.allyCode;

    }
}
module.exports = GuildZeta;