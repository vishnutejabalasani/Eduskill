const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });

const User = require('./models/User');
const Message = require('./models/Message');

const debug = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Connected to DB');

        const messages = await Message.find({});
        console.log(`Total Messages: ${messages.length}`);

        for (const msg of messages) {
            const sender = await User.findById(msg.sender);
            const recipient = await User.findById(msg.recipient);

            console.log(`\nMsg ID: ${msg._id}`);
            console.log(`Content: ${msg.content}`);
            console.log(`Sender: ${sender ? sender.name : 'Unknown'} (${msg.sender})`);
            console.log(`Recipient: ${recipient ? recipient.name : 'Unknown'} (${msg.recipient})`);
        }

        console.log('\n--- check specific user conversations ---');
        // Let's try to simulate the getConversations logic for a user
        // We need an ID. Let's take the recipient of the first message.
        if (messages.length > 0) {
            const targetId = messages[0].recipient;
            const targetUser = await User.findById(targetId);
            console.log(`Simulating for User: ${targetUser.name} (${targetId})`);

            const sentMessages = await Message.find({ sender: targetId }).distinct('recipient');
            const receivedMessages = await Message.find({ recipient: targetId }).distinct('sender');

            console.log('Sent To IDs:', sentMessages);
            console.log('Received From IDs:', receivedMessages);

            const uniqueUserIds = [...new Set([
                ...sentMessages.map(id => id.toString()),
                ...receivedMessages.map(id => id.toString())
            ])];

            console.log('Unique Partner IDs:', uniqueUserIds);

            const partners = await User.find({ _id: { $in: uniqueUserIds } });
            console.log('Partners found:', partners.map(p => p.name));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

debug();
