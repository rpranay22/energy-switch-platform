import { useEffect, useRef, useState } from "react";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hi! I am your onboarding assistant. Ask me about MPRN, Eircode, meter reading, switching process, or dynamic pricing.",
        },
    ]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const quickQuestions = [
        "What is MPRN?",
        "Why do you need my Eircode?",
        "Where do I find my meter number?",
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

        if (!text.trim()) return;

        const userMessage = { sender: "user", text };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("https://energy-switch-platform-6.onrender.com/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) {
                throw new Error("Failed to get chatbot response");
            }

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: data.reply || "Sorry, I could not answer that." },
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Sorry, the chatbot service is currently unavailable.",
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
                        />
                        <button onClick={() => sendMessage()}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chatbot;