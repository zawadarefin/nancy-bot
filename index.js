const path = require("path"); // ✅ FIX: Import the 'path' module
const fs = require("fs");
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ActivityType } = require('discord.js');
const keepAlive = require(`./server`);
// const express = require('express');
// const app = express();



require('dotenv').config();  // Load environment variables
const readline = require('readline');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);


    client.user.setPresence({
        activities: [{ name: "with Zawad", type: ActivityType.LISTENING }],
        status: 'online' // Other options: 'idle', 'dnd', 'invisible'
    });
});
client.on('messageCreate', (message) => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});



client.on('messageCreate', (message) => {
    if (message.content === '!ntimetable') {
        message.channel.send('https://cdn.discordapp.com/attachments/1345359086593507341/1346016809958244394/IMG_4054.png?ex=67c6a757&is=67c555d7&hm=60072e21b1cb675d2bb420b855e420a81da4437f818dbbedbdf18d3a8ef87140&format=webp&quality=lossless&width=1010&height=757');
    }
});

client.on('messageCreate', (message) => {
    if (message.content === '!ztimetable') {
        message.channel.send('https://media.discordapp.net/attachments/1345359086593507341/1346085487269515326/VDGgNVF70inBvx72egUr-1.png?ex=67c6e74d&is=67c595cd&hm=6ae6df738782c629ae3641b98ef2ce8e440ce6c3f8dd732386be2233c4218189&=&format=webp&quality=lossless&width=738&height=757');
    }
});

client.on('messageCreate', (message) => {
    if (message.content === '!zawad') {
        message.channel.send('I love Nancy!');
    }
});

client.on('messageCreate', (message) => {
    if (message.content === '!nancy') {
        message.channel.send('I love Zawad!')
    }
})


client.on('messageCreate', (message) => {
    if (message.content === '!embed') {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff) // Blue color
            .setTitle('TEST EMBEFICIATION')
            .setDescription('I love nancy ngoc linh ho')
            .setTimestamp()
            .setFooter({ text: 'nancy <3', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    }
});


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const channel = client.channels.cache.get('1345359086593507341');  // Replace with your channel ID
    if (channel) {
        channel.send(input);
        console.log(`Sent: ${input}`);  // Log the sent message
    } else {
        console.log('Channel not found.');
    }
});



// !help command
client.on('messageCreate', (message) => {
    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Available Commands')
            .setDescription('Here are all the commands you can use:')
            .addFields(
                { name: '!help', value: 'List all the commands available for you.' },
            )
            .setTimestamp()
            .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [helpEmbed] });

        const helpEmbed2 = new EmbedBuilder()
            .setColor(0x0081d6)
            .setTitle('Call Commands')
            .setDescription('Commands regarding calls:')
            .addFields(
                { name: '!timer [time in hours]', value: 'Set a sleep timer for the bot to disconnect all users from the voice channel after the specified time in hours.' },
                { name: '!duration', value: 'Check the duration of the current call you are in.' },
                { name: '!topcalls', value: 'Display the top 10 longest calls in the server.' },
            )
            .setTimestamp()
            .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [helpEmbed2] });


        const helpEmbed3 = new EmbedBuilder()
            .setColor(0x0062a3)
            .setTitle('Todolist')
            .setDescription('Commands to operate the todolist:')
            .addFields(
                { name: '!todo [item] [item2]', value: 'Add items to your todolist' },
                { name: '!todo view', value: 'View your current Todo list.' }
            )
            .setTimestamp()
            .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [helpEmbed3] });

        const helpEmbed4 = new EmbedBuilder()
            .setColor(0x00568f)
            .setTitle('Misc commmands')
            .setDescription('All the misc cutie patootie commands ❤:')
            .addFields(
                { name: '!ntimetable', value: "Display Nancy's timetable" },
                { name: '!ztimetable', value: "Display Zawad's timetable" },
                { name: '!zawad', value: 'A very honest message quoting the greatest Zawad himself' },
                { name: '!nancy', value: 'A cute message quoting the princess Nancy herself' },
            )
            .setTimestamp()
            .setFooter({ text: '<3 Nancy', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [helpEmbed4] });

    

    
    }
});



let activeTimers = {};  // To track active timers for each voice channel
let activeTimerMessages = {}; // To track the message reference for the countdown timer

// Sleep Timer
client.on('messageCreate', (message) => {
    if (message.content.startsWith('!timer')) {
        const args = message.content.split(' ');
        const hours = parseInt(args[1]);

        // Check if the user is in a voice channel
        if (!message.member.voice.channel) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('Error')
                .setDescription('You need to be in a voice channel to use this command!')
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });
            return message.channel.send({ embeds: [errorEmbed] });
        }

        const voiceChannel = message.member.voice.channel;

        // Check if user wants to stop the timer by typing !timer 0
        if (hours === 0) {
            if (activeTimers[voiceChannel.id]) {
                clearTimeout(activeTimers[voiceChannel.id].timer); // Stop the timer
                clearInterval(activeTimers[voiceChannel.id].interval); // Stop the periodic updates
                delete activeTimers[voiceChannel.id];  // Remove from active timers
                delete activeTimerMessages[voiceChannel.id];  // Remove message reference

                const stopEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('Timer Stopped')
                    .setDescription(`The timer for **${voiceChannel.name}** has been stopped.`)
                    .setTimestamp()
                    .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [stopEmbed] });
            } else {
                const noTimerEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('No Active Timer')
                    .setDescription(`There is no active timer for **${voiceChannel.name}**.`)
                    .setTimestamp()
                    .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });
                return message.channel.send({ embeds: [noTimerEmbed] });
            }
        }

        // Validate if the time provided is a valid number of hours
        if (isNaN(hours) || hours <= 0) {
            const invalidTimeEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('Invalid Time')
                .setDescription('Please provide a valid number of hours.')
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });
            return message.channel.send({ embeds: [invalidTimeEmbed] });
        }

        // Calculate the time in milliseconds
        const timeInMs = hours * 60 * 60 * 1000;

        // Store the timer for this voice channel
        activeTimers[voiceChannel.id] = {
            remainingTime: timeInMs,  // Store the total remaining time
            timer: setTimeout(() => {
                // When the timer finishes, disconnect all users from the voice channel
                voiceChannel.members.forEach(member => {
                    member.voice.disconnect();
                });

                const endEmbed = new EmbedBuilder()
                    .setColor(0xff0000)  // Red color for disconnect event
                    .setTitle('Voice Channel Timeout')
                    .setDescription(`The timer for **${voiceChannel.name}** has ended, and all users have been disconnected.`)
                    .addFields(
                        { name: 'Duration', value: `${hours} hour(s)`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

                // Send the embed to a text channel
                const textChannel = message.guild.channels.cache.get('1345360596828426280');
                if (textChannel) {
                    textChannel.send({ embeds: [endEmbed] });
                }

                // Remove the timer from the activeTimers object
                delete activeTimers[voiceChannel.id];
                delete activeTimerMessages[voiceChannel.id]; // Remove the message reference
            }, timeInMs),
            interval: setInterval(() => {
                // Update remaining time every second and show in an embed
                const remainingHours = Math.floor(activeTimers[voiceChannel.id].remainingTime / (1000 * 60 * 60));
                const remainingMinutes = Math.floor((activeTimers[voiceChannel.id].remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const remainingSeconds = Math.floor((activeTimers[voiceChannel.id].remainingTime % (1000 * 60)) / 1000);

                const updateEmbed = new EmbedBuilder()
                    .setColor(0x0099ff)  // Blue color for timer updates
                    .setTitle('Timer Update')
                    .setDescription(`Time remaining for **${voiceChannel.name}**:`)
                    .addFields(
                        { name: 'Remaining Time', value: `${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

                // If we have the message reference, edit the existing message
                const textChannel = message.guild.channels.cache.get('1345360596828426280');
                if (textChannel && activeTimerMessages[voiceChannel.id]) {
                    activeTimerMessages[voiceChannel.id].edit({ embeds: [updateEmbed] });
                }

                // Decrease the remaining time by 1 second
                activeTimers[voiceChannel.id].remainingTime -= 1000;
                if (activeTimers[voiceChannel.id].remainingTime <= 0) {
                    clearInterval(activeTimers[voiceChannel.id].interval); // Stop updating once the timer is finished
                }
            }, 1000)  // Update every second
        };

        // Send the initial embed to the text channel and store the message reference
        const startEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Timer Started')
            .setDescription(`A **${hours} hour(s)** timer has been set for **${voiceChannel.name}**. After this time, all users will be disconnected.`)
            .setTimestamp()
            .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

        const textChannel = message.guild.channels.cache.get('1345360596828426280');
        if (textChannel) {
            textChannel.send({ embeds: [startEmbed] }).then(sentMessage => {
                activeTimerMessages[voiceChannel.id] = sentMessage;  // Store the message reference
            });
        }
    }
});



// Call Duration

let callStartTimes = {};  // To track call start times by channel ID
let activeCalls = {};  // To track if a call is active in a channel

client.on('voiceStateUpdate', (oldState, newState) => {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    // Handle when a user joins a voice channel
    if (!oldChannel && newChannel) {
        const channelId = newChannel.id;
        if (!activeCalls[channelId]) {
            const embed = new EmbedBuilder()
                .setColor(0x5de602)
                .setTitle('Call Started')
                .setDescription(`A call has started in **${newChannel.name}** 🎤`)
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: client.user.displayAvatarURL() });

            const textChannel = newState.guild.channels.cache.get('1345385715491536927');
            if (textChannel) {
                textChannel.send({ embeds: [embed] });
            }

            activeCalls[channelId] = true;
            callStartTimes[channelId] = Date.now();  // Store start time
        }
    }

    // Handle when a user leaves a voice channel
    if (oldChannel && !newChannel) {
        const channelId = oldChannel.id;

        if (oldChannel.members.size === 0 && activeCalls[channelId]) {
            const callDuration = Date.now() - callStartTimes[channelId];
            const durationHours = Math.floor(callDuration / 3600000);
            const durationMinutes = Math.floor((callDuration % 3600000) / 60000);
            const durationSeconds = Math.floor((callDuration % 60000) / 1000);

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('Call Ended')
                .setDescription(`The call in **${oldChannel.name}** has ended! 🎤`)
                .addFields(
                    { name: 'Call Duration', value: `${durationHours}h ${durationMinutes}m ${durationSeconds}s`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: client.user.displayAvatarURL() });

            const textChannel = oldState.guild.channels.cache.get('1345385715491536927');
            if (textChannel) {
                textChannel.send({ embeds: [embed] });
            }

            // Save the call duration to the database
            callDurations.push({
                channelName: oldChannel.name,
                duration: callDuration,
                timestamp: Date.now()
            });
            saveCallDurations();

            delete activeCalls[channelId];
            delete callStartTimes[channelId];
        }
    }
});

// Command to Check Call Duration
client.on('messageCreate', (message) => {
    if (message.content === '!duration') {
        if (!message.member.voice.channel) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('Error')
                .setDescription('You need to be in a voice channel to check the call duration!')
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

            return message.channel.send({ embeds: [errorEmbed] });
        }

        const voiceChannel = message.member.voice.channel;
        const channelId = voiceChannel.id;

        if (!activeCalls[channelId]) {
            const noCallEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('No Active Call')
                .setDescription(`There is no active call in **${voiceChannel.name}**.`)
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

            return message.channel.send({ embeds: [noCallEmbed] });
        }

        const callStartTime = callStartTimes[channelId];
        const callDuration = Date.now() - callStartTime;

        // Convert time to hours, minutes, and seconds
        const hours = Math.floor(callDuration / 3600000);
        const minutes = Math.floor((callDuration % 3600000) / 60000);
        const seconds = Math.floor((callDuration % 60000) / 1000);

        // Format duration string
        let durationString = '';
        if (hours > 0) durationString += `${hours}h `;
        if (minutes > 0 || hours > 0) durationString += `${minutes}m `;
        durationString += `${seconds}s`;

        const durationEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Call Duration')
            .setDescription(`The call in **${voiceChannel.name}** has been active for:`)
            .addFields(
                { name: 'Duration', value: durationString, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Voice Channel Activity', iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [durationEmbed] });
    }
});

const TODO_FILE = path.join(__dirname, "todolist.json");

let todoLists = {}; // Store all user to-do lists

// Load to-do lists from file
function loadTodoLists() {
    try {
        const data = fs.readFileSync(TODO_FILE, "utf-8");
        todoLists = JSON.parse(data);
    } catch (err) {
        todoLists = {};
    }
}

// Save to-do lists to file
function saveTodoLists() {
    fs.writeFileSync(TODO_FILE, JSON.stringify(todoLists, null, 2));
}

// When the bot is ready
client.once("ready", () => {
    console.log("Bot is online!");
    loadTodoLists(); // Load saved to-do lists on bot startup
});

const CALLS_DB_FILE = path.join(__dirname, "calls.json");

let callDurations = []; // Store all call durations

// Load call durations from file
function loadCallDurations() {
    try {
        const data = fs.readFileSync(CALLS_DB_FILE, "utf-8");
        callDurations = JSON.parse(data);
    } catch (err) {
        callDurations = [];
    }
}

// Save call durations to file
function saveCallDurations() {
    fs.writeFileSync(CALLS_DB_FILE, JSON.stringify(callDurations, null, 2));
}

// Load call durations on bot startup
loadCallDurations();

// Command handler
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!todo")) return;

    const args = message.content.match(/\[(.*?)\]/g);
    const userId = message.author.id;

    // Handle the case when no arguments are passed
    if (!args) {
        // Check if the command is to view the todo list
        if (message.content === "!todo view") {
            if (!todoLists[userId] || todoLists[userId].tasks.length === 0) {
                return message.channel.send({ embeds: [new EmbedBuilder().setColor(0xff0000).setTitle("Your Todo List is Empty!")] });
            }
            return sendTodoList(message, userId);
        }
        return;
    }

    // Extract tasks from the brackets
    const tasks = args.map((task) => task.replace(/\[|\]/g, ""));

    // If the user doesn't have a to-do list, create one
    if (!todoLists[userId]) {
        todoLists[userId] = { creatorId: userId, tasks: [] };
    }

    // Update the user's to-do list with new tasks
    todoLists[userId].tasks = tasks.map((task) => ({ text: task, checked: false }));

    // Save the updated to-do list to the JSON file
    saveTodoLists();

    return sendTodoList(message, userId);
});

// Interaction handler for selecting tasks to check off
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    const userId = interaction.user.id;
    const selectedIndex = parseInt(interaction.values[0]);

    // Ensure that the user has a to-do list
    if (!todoLists[userId]) {
        return interaction.reply({ content: "You don't have a to-do list yet.", ephemeral: true });
    }

    // Prevent the user from interacting with another user's to-do list
    const creatorId = todoLists[userId].creatorId;

    // If the to-do list was created by someone else, prevent interaction
    if (creatorId !== userId) {
        return interaction.reply({ content: "You can't modify someone else's to-do list!", ephemeral: true });
    }

    // Ensure the selected index is within range
    if (selectedIndex < 0 || selectedIndex >= todoLists[userId].tasks.length) {
        return interaction.reply({ content: "Invalid task selection.", ephemeral: true });
    }

    // Toggle task completion
    todoLists[userId].tasks[selectedIndex].checked = !todoLists[userId].tasks[selectedIndex].checked;

    // Save updated to-do lists
    saveTodoLists();

    // Update the message with the updated to-do list
    await interaction.update({
        embeds: [generateTodoEmbed(userId)],
        components: [generateTodoDropdown(userId)],
    }).catch(error => {
        console.error('Error updating interaction:', error);
        interaction.reply({ content: 'There was an error updating your to-do list.', ephemeral: true });
    });
});

// Send the user's to-do list with dropdown
function sendTodoList(message, userId) {
    return message.channel.send({
        embeds: [generateTodoEmbed(userId)],
        components: [generateTodoDropdown(userId)],
    });
}

// Generate embed for the to-do list
function generateTodoEmbed(userId) {
    const list = todoLists[userId].tasks
        .map((task, index) => `${task.checked ? "✅" : "❌"} **${index + 1}.** ${task.checked ? `~~${task.text}~~` : task.text}`)
        .join("\n");

    return new EmbedBuilder()
        .setColor(0xbccda6)
        .setTitle("Your Todo List")
        .setDescription(list || "No tasks available.")
        .setFooter({ text: "Use the dropdown below to check off items!" });
}

// Generate dropdown menu for the to-do list
function generateTodoDropdown(userId) {
    const menu = new StringSelectMenuBuilder()
        .setCustomId("todo_select")
        .setPlaceholder("Select a task to mark as done")
        .addOptions(
            todoLists[userId].tasks.map((task, index) => ({
                label: task.text,
                value: index.toString(),
                description: task.checked ? "Checked" : "Unchecked",
            }))
        );

    return new ActionRowBuilder().addComponents(menu);
}

client.on('messageCreate', (message) => {
    if (message.content === '!topcalls') {
        // Sort call durations by duration in descending order and get the top 10
        const topCalls = callDurations.sort((a, b) => b.duration - a.duration).slice(0, 10);

        // Create an embed to display the top 10 longest calls
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Top 10 Longest Calls')
            .setDescription('Here are the top 10 longest calls:')
            .setTimestamp()
            .setFooter({ text: 'Call Leaderboard', iconURL: message.author.displayAvatarURL() });

        topCalls.forEach((call, index) => {
            const durationHours = Math.floor(call.duration / 3600000);
            const durationMinutes = Math.floor((call.duration % 3600000) / 60000);
            const durationSeconds = Math.floor((call.duration % 60000) / 1000);
            const durationString = `**${durationHours}h ${durationMinutes}m ${durationSeconds}s**`;

            embed.addFields({ name: `#${index + 1}`, value: `Duration: ${durationString}`, inline: false });
        });

        message.channel.send({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);

keepAlive();


// app.get('/', (req, res) => {
//     console.log(`Received request from: ${req.headers.host}`);
//     res.send('Bot is running!');
// });

// app.listen(3000, () => {
//     console.log('Web server started');
// });