const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const User = require('./models/User');
const Message = require('./models/Message');

const debug = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);

        // ID for 'random'
        const currentUserId = '6970d89cea1e8218396bdf24';
        console.log(`Simulating for User ID: ${currentUserId}`);

        // 1. Find all messages involving the current user
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { recipient: currentUserId }]
        }).sort({ createdAt: -1 });

        console.log(`Total raw messages found: ${messages.length}`);

        // 2. Extract unique partner IDs (EXACT LOGIC FROM CONTROLLER)
        const partnerIds = new Set();
        messages.forEach(msg => {
            const senderId = msg.sender.toString();
            const recipientId = msg.recipient.toString();

            // Log for debugging
            if (senderId === currentUserId && recipientId === currentUserId) {
                console.log('ALERT: Self-message found!', msg._id);
            }

            if (senderId !== currentUserId) partnerIds.add(senderId);
            if (recipientId !== currentUserId) partnerIds.add(recipientId);
        });

        console.log('Partner IDs computed:', Array.from(partnerIds));

        // 3. Fetch user details for these partners
        const partners = await User.find({ _id: { $in: Array.from(partnerIds) } })
            .select('name');

        console.log('Partners Returned (API would return this):');
        partners.forEach(p => console.log(`- ${p.name} (${p._id})`));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

debug();
