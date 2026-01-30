import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Send, User, Search, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

const MessagesPage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const targetUserId = searchParams.get('userId');

    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef(null);

    // Fetch conversations list
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/messages/conversations');
                console.log("Conversations response:", res.data); // Debug
                // Client-side filter to ensure no self-chats appear
                const validConvs = res.data.data.conversations.filter(c => c.user._id !== user?._id);
                setConversations(validConvs);

                // If URL has userId, find or fetch that user to set active
                if (targetUserId) {
                    const existingConv = validConvs.find(c => c.user._id === targetUserId);
                    if (existingConv) {
                        setActiveChat(existingConv.user);
                    } else {
                        // User not in history yet, fetch details manually to start fresh chat
                        // NOTE: You might need a specific endpoint to get a single user's public info if not in list.
                        // For now, assuming if clicking 'Message' on FindTalent, we might need to fetch that user.
                        // fallback: we will handle this in 'fetchMessages' logic or separate check.
                        // Simplification: We will try to fetch messages for this targetID. 
                        // If empty, we still set activeChat object if we can get their name/avatar from somewhere.
                        // Ideally backend 'getConversations' or a new 'getUser' is needed.
                        // Let's assume for now we just start with limited info or fetch it.
                        // Actually, let's fetch the user details if not in conversation list.
                        const userRes = await api.get(`/users/${targetUserId}`);
                        setActiveChat(userRes.data.data.user);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [targetUserId]);

    // Fetch messages when active chat changes
    useEffect(() => {
        if (!activeChat) return;

        const fetchMessages = async () => {
            try {
                const res = await api.get(`/messages/${activeChat._id}`);
                setMessages(res.data.data.messages);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        fetchMessages();
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [activeChat]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        console.log("Attempting to send...", { newMessage, activeChatId: activeChat?._id }); // Debug

        if (!newMessage.trim() || !activeChat) {
            console.log("Send aborted: empty message or no active chat");
            return;
        }

        setSending(true);
        try {
            const res = await api.post('/messages', {
                recipientId: activeChat._id,
                content: newMessage
            });
            console.log("Send success:", res.data);

            // Append immediately
            setMessages(prev => [...prev, res.data.data.message]);
            setNewMessage('');

            // Refresh conversations to update order/snippet
            const convRes = await api.get('/messages/conversations');
            const validConvs = convRes.data.data.conversations.filter(c => c.user._id !== user?._id);
            setConversations(validConvs);

        } catch (err) {
            console.error("Failed to send message:", err.response || err);
            // Optionally show an alert or toast here
        } finally {
            setSending(false);
        }
    };

    const handleHiringResponse = async (chatId, type) => {
        const responseContent = type === 'accept'
            ? "✅ **Request Accepted**\n\nI'm happy to accept your request! Let's discuss the details further."
            : "❌ **Request Declined**\n\nThank you for the offer, but I am unable to accept at this time.";

        try {
            const res = await api.post('/messages', {
                recipientId: chatId,
                content: responseContent
            });

            // Append response immediately to chat
            setMessages(prev => [...prev, res.data.data.message]);
        } catch (err) {
            console.error("Failed to send response", err);
            alert("Failed to send response.");
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] glass-panel rounded-2xl overflow-hidden">
            {/* Sidebar (Conversations) */}
            <div className="w-1/3 border-r border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <h2 className="font-bold text-xl text-white mb-4">{t('messages.title')}</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('messages.search')}
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#00E676]/50"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#00E676]" /></div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {t('messages.noConversations')}
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.user._id}
                                onClick={() => setActiveChat(conv.user)}
                                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${activeChat?._id === conv.user._id ? 'bg-white/10' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-white relative">
                                        {conv.user.name.charAt(0)}
                                        {/* Status Dot (Mock) */}
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-sm text-white truncate">{conv.user.name}</h4>
                                            <span className="text-xs text-gray-500">
                                                {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-black/20">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E676] to-emerald-700 flex items-center justify-center font-bold text-black">
                                {activeChat.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{activeChat.name}</h3>
                                <p className="text-xs text-[#00E676]">Online</p>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map(msg => {
                                const isMe = msg.sender === user?._id;
                                return (
                                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl p-4 ${isMe
                                            ? 'bg-[#00E676] text-black rounded-tr-sm'
                                            : 'bg-white/10 text-white rounded-tl-sm'
                                            }`}>
                                            <div className="text-sm whitespace-pre-wrap message-content">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ node, ...props }) => <span {...props} />, // Render paragraphs as spans to avoid margin issues
                                                        strong: ({ node, ...props }) => <span className="font-bold" {...props} />
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-black/60' : 'text-white/40'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={t('messages.typePlaceholder')}
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E676]/50"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="bg-[#00E676] text-black p-3 rounded-xl hover:bg-[#00c853] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <User size={40} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('messages.selectChat')}</h3>
                        <p>{t('messages.selectChatDesc')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
