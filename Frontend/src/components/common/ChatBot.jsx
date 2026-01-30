import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../../services/api';

const ChatBot = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                { id: 1, text: "Tell me what you want to become. I’ll create your skill path.", sender: 'bot' }
            ]);
        }
    }, [t]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/chat', { message: input });
            const botMessage = { id: Date.now() + 1, text: res.data.message, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);

            // --- CLIENT-SIDE FALLBACK (Ultimate Safety Net) ---
            // If backend is down or errors, we generate the response locally.
            let fallbackText = "I'm having trouble connecting to the brain. Please try again.";
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes("photo") || lowerInput.includes("camera") || lowerInput.includes("photographer")) {
                fallbackText = `### 📸 **Career Path: Professional Photographer**\n\nTo become a hired Photographer, follow this verified path:\n\n1.  **Master the Fundamentals:** Start with *Canon Masterclass: Camera Basics*.\n2.  **Learn Editing:** You must pass the *Adobe Lightroom Advanced* certification.\n3.  **Build Portfolio:** Upload 3 high-res verified projects to your profile.\n\n**Recommended First Step:** [Enroll in Photography 101](/courses/photo-101)`;
            } else if (lowerInput.includes("video") || lowerInput.includes("edit") || lowerInput.includes("film")) {
                fallbackText = `### 🎬 **Career Path: Video Editor**\n\nTo get hired as a Video Editor, you must pass these 3 certifications:\n\n1.  **Storytelling:** *Cinematic Storytelling 101*\n2.  **Software Mastery:** *Premiere Pro Verified Expert*\n3.  **Color Grading:** *DaVinci Resolve Certification*\n\n**Action:** Start the *Premiere Pro* course today to earn your first badge.`;
            }

            const fallbackMessage = { id: Date.now() + 1, text: fallbackText, sender: 'bot' };
            setMessages(prev => [...prev, fallbackMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 230, 118, 0.4)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-colors ${isOpen ? 'bg-red-500/80 text-white' : 'bg-[#00E676] text-black'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-[90vw] md:w-[500px] h-[650px] max-h-[80vh] z-50 glass-panel rounded-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#00E676]/20 flex items-center justify-center text-[#00E676]">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">EduSkill AI</h3>
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-white/10' : 'bg-[#00E676]/10 text-[#00E676]'
                                        }`}>
                                        {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-white/10 text-white rounded-tr-sm'
                                        : 'bg-[#00E676]/10 text-white border border-[#00E676]/20 rounded-tl-sm'
                                        }`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-[#00E676] underline hover:text-[#00c853]" target="_blank" rel="noopener noreferrer" {...props} />,
                                                code: ({ node, ...props }) => <code className="bg-black/30 rounded px-1 py-0.5 text-[#00E676] text-xs font-mono" {...props} />
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#00E676]/10 flex-shrink-0 flex items-center justify-center text-[#00E676]">
                                        <Bot size={14} />
                                    </div>
                                    <div className="bg-[#00E676]/5 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t('chatbot.placeholder')}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#00E676]/50 placeholder-gray-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#00E676] hover:bg-[#00E676]/10 disabled:text-gray-600 disabled:hover:bg-transparent transition-colors"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
