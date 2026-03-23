const express = require("express");
const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "Qwen/Qwen2.5-7B-Instruct",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an onboarding assistant for an electricity switching platform. Help users understand MPRN, Eircode, meter reading, switching process, and dynamic pricing in simple language."
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });

        const data = await response.json();

        console.log("HF response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            return res.status(response.status).json({
                reply: data.error || data.message || "Hugging Face API error"
            });
        }

        const reply =
            data?.choices?.[0]?.message?.content ||
            "Sorry, I could not generate a response.";

        res.json({ reply });
    } catch (error) {
        console.error("Chat route error:", error);
        res.status(500).json({
            reply: "Chat service is currently unavailable."
        });
    }
});

module.exports = router;