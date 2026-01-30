const Message = require('../models/Message');
const User = require('../models/User');

// Send a new message
exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;

        if (!recipientId || !content) {
            return res.status(400).json({ status: 'fail', message: 'Recipient and content are required' });
        }

        const newMessage = await Message.create({
            sender: req.user._id,
            recipient: recipientId,
            content
        });

        res.status(201).json({
            status: 'success',
            data: { message: newMessage }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Get chat history with a specific user
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: userId },
                { sender: userId, recipient: req.user._id }
            ]
        })
            .sort({ createdAt: 1 }); // Sort by oldest to newest for chat view

        // Mark incoming messages as read
        await Message.updateMany(
            { sender: userId, recipient: req.user._id, read: false },
            { read: true }
        );

        res.status(200).json({
            status: 'success',
            results: messages.length,
            data: { messages }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Get list of all users you have conversations with
exports.getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id.toString();

        // 1. Find all messages involving the current user
        const messages = await Message.find({
            $or: [{ sender: req.user._id }, { recipient: req.user._id }]
        }).sort({ createdAt: -1 });

        // 2. Extract unique partner IDs
        const partnerIds = new Set();
        messages.forEach(msg => {
            const senderId = msg.sender.toString();
            const recipientId = msg.recipient.toString();

            if (senderId !== currentUserId) partnerIds.add(senderId);
            if (recipientId !== currentUserId) partnerIds.add(recipientId);
        });

        // 3. Fetch user details for these partners
        const partners = await User.find({ _id: { $in: Array.from(partnerIds) } })
            .select('name title avatar');

        // 4. Build conversation objects
        const conversations = await Promise.all(partners.map(async (user) => {
            // Find the very last message with this specific partner
            const lastMsg = await Message.findOne({
                $or: [
                    { sender: req.user._id, recipient: user._id },
                    { sender: user._id, recipient: req.user._id }
                ]
            }).sort({ createdAt: -1 });

            // Count unread (where I am recipient and read is false)
            const unreadCount = await Message.countDocuments({
                sender: user._id,
                recipient: req.user._id,
                read: false
            });

            return {
                user,
                lastMessage: lastMsg ? lastMsg.content : '',
                lastMessageAt: lastMsg ? lastMsg.createdAt : null,
                unreadCount
            };
        }));

        // 5. Sort by most recent activity
        conversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

        res.status(200).json({
            status: 'success',
            results: conversations.length,
            debug_info: {
                myId: currentUserId,
                partnersFound: partners.length
            },
            data: { conversations }
        });
    } catch (err) {
        console.error("getConversations Error:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
