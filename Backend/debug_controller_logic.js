const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });

const User = require('./models/User');
const Message = require('./models/Message');

const debug = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);

        // Hardcode Teja Admin's ID from previous log
        const myId = '6964f2b7b8d1c4a458fe2324'; // Teja Admin

        console.log(`Running getConversations simulation for User ID: ${myId}`);

        // 1. Find unique users
        const sentMessages = await Message.find({ sender: myId }).distinct('recipient');
        const receivedMessages = await Message.find({ recipient: myId }).distinct('sender');

        console.log('Sent To:', sentMessages);
        console.log('Received From:', receivedMessages);

        const uniqueUserIds = [...new Set([
            ...sentMessages.map(id => id.toString()),
            ...receivedMessages.map(id => id.toString())
        ])];

        console.log('Unique IDs:', uniqueUserIds);

        // 2. Fetch users
        // NOTE: we filter out the current user from the list?
        // Usually you DON'T start a chat with yourself in the "inbox", unless you allow self-chat.
        // But if I strictly follow the code I wrote:

        const users = await User.find({ _id: { $in: uniqueUserIds } })
            .select('name title avatar');

        console.log('Users Found:', users.map(u => u.name));

        // 3. Enhance with last message
        const conversations = await Promise.all(users.map(async (user) => {
            console.log(`\nProcessing partner: ${user.name} (${user._id})`);

            const lastMsg = await Message.findOne({
                $or: [
                    { sender: myId, recipient: user._id },
                    { sender: user._id, recipient: myId }
                ]
            }).sort({ createdAt: -1 });

            if (lastMsg) {
                console.log(`   Found MSG: "${lastMsg.content}"`);
                console.log(`   Sender: ${lastMsg.sender}`);
                console.log(`   Recipient: ${lastMsg.recipient}`);
            } else {
                console.log('   No message found?');
            }

            return {
                user,
                lastMessage: lastMsg ? lastMsg.content : '',
                lastMessageAt: lastMsg ? lastMsg.createdAt : null,
            };
        }));

        // 4. Sort
        conversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

        console.log('\nFINAL RESULT (API Response):');
        conversations.forEach(c => {
            console.log(`- [${c.user.name}] Last Msg: "${c.lastMessage}"`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

debug();
