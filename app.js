const tmi = require('tmi.js');
const axios = require('axios');

// Define configuration options
const opts = {
    options: {
        debug: true,
    },
    identity: {
        username: "covid19th",
        password: "m695kcq6nbnyskqeo0tq69j48jc5bk"
    },
    channels: [
        "boysickchannel",
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

//arrays
const blocked_words = ['bababoii', 'trip', 'cats'];
const colors = ["SpringGreen", "Blue", "Chocolate", "Red", "Coral", "Firebrick", "OrangeRed", "SeaGreen", "Green", "HotPink"];
//colors.toString();


// Register our event handlers (defined below)
client.on('chat', onChatHandler);
client.on('connected', onConnectedHandler);
client.on('message', (channel, userstate, message, self) => {
    if (self) return;
    //if (userstate.username === BOT_USERNAME) return;
    if (message.toLowerCase() === '!hello') {
        client.say(channel, `@${userstate.username}, hello!`);
    }
    checkChat(channel, userstate, message);
});

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onChatHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();

    if (commandName === '!covid') {
        axios.get('https://covid19.th-stat.com/api/open/today')
            .then(function(response) {
                client.say(target, "ติดเชื้อ : " + response.data.Confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "(+" + response.data.NewConfirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")" +
                    " หายแล้ว : " + response.data.Recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "(+" +
                    response.data.NewRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")" + " รักษา : " +
                    response.data.Hospitalized.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "(+" +
                    response.data.NewHospitalized.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")" +
                    " เสียชีวิต : " + response.data.Deaths + "(+" + response.data.NewDeaths + ")");
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            .then(function() {
                // always executed
            });
    }

}

//check twitch chat, delete message which isnt suitable and respond to it
function checkChat(channel, username, message) {
    let shouldSendMessage = false;
    //check message
    message = message.toLowerCase();
    shouldSendMessage = blocked_words.some(blockedWord => message.includes(blockedWord.toLowerCase()));
    //tell user
    // client.say(channel, `@${username.username} oopsie message deleted`);
    //delete message
    if (shouldSendMessage) {
        client.deletemessage(channel, username.id)
            .then((data) => {
                //nothing
            }).catch((err) => {
                //nothing
            });
        client.say(channel, `@${username.username} oopsie message deleted`);
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    //client.say('Lonermoan', `connected to ${addr} and ${port}`);
    client.action('Lonermoan', 'Hello Lonermoan, lame bot here');
}