import { useEffect, useRef, useState } from "react";

const API_BASE =
    process.env.REACT_APP_API_URL ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:5002"
        : "https://ui-dev-backend.onrender.com");

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hi! I am your onboarding assistant. Ask me about MPRN, your current provider, switching, or dynamic pricing.",
        },
    ]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const quickQuestions = [
        "What is MPRN?",
        "Why do you need my current provider?",
        "What is dynamic pricing?",
        "What happens after I submit?",
    ];

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading]);

    const sendMessage = async (customText = null) => {
        const text = customText || input;

        if (!text.trim() || loading) return;

        const userMessage = { sender: "user", text };
        const nextMessages = [...messages, userMessage];

        setMessages(nextMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                    history: nextMessages.slice(-8).map((msg) => ({
                        role: msg.sender === "user" ? "user" : "assistant",
                        content: msg.text,
                    })),
                }),
            });

            const data = await response.json().catch(() => ({}));

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text:
                        (typeof data.reply === "string" && data.reply) ||
                        "Sorry, Hugging Face did not return a reply.",
                },
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Could not reach the chat API. Start the backend and set HF_API_KEY.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="chat-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open chatbot"
            >
                💬
            </button>

            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <div>
                            <h3>AI Onboarding Assistant</h3>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            ✕
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.sender === "user" ? "user-message" : "bot-message"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}

                        <div className="quick-questions">
                            {quickQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    className="quick-btn"
                                    onClick={() => sendMessage(question)}
                                    disabled={loading}
                                >
                                    {question}
                                </button>
                            ))}
                        </div>

                        {loading && <div className="bot-message">Typing...</div>}
                        <div ref={messagesEndRef}></div>
                    </div>

                    <div className="chatbot-input-area">
                        <input
                            type="text"
                            placeholder="Type your question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                            disabled={loading}
                        />
                        <button onClick={() => sendMessage()} disabled={loading}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chatbot;
