const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const SYSTEM_PROMPT = `You are an onboarding assistant for an Irish electricity switching platform.
Answer in plain English, in 2 to 4 short sentences.
The form collects name, email, phone, Eircode, address, current electricity provider, and MPRN.
If the user asks why we collect current electricity provider or MPRN:

- Current electricity provider: to request the transfer from the right supplier.
- MPRN: this uniquely identifies the electricity connection and is required to complete the switch.

Do not invent account details. If you are unsure, say so briefly.`;

const DEFAULT_MODEL = "Qwen/Qwen3-4B-Instruct-2507:fastest";

const DEPRECATED_MODELS = {
    "Qwen/Qwen2.5-7B-Instruct": DEFAULT_MODEL,
    "Qwen/Qwen2.5-7B-Instruct-1M": DEFAULT_MODEL,
};

function getModelName() {
    const requested = (process.env.HF_MODEL || DEFAULT_MODEL).trim();
    return DEPRECATED_MODELS[requested] || requested;
}

function getHfClient() {
    const apiKey = process.env.HF_API_KEY || process.env.HF_TOKEN;

    if (!apiKey) {
        return null;
    }

    return new OpenAI({
        baseURL: "https://router.huggingface.co/v1",
        apiKey,
    });
}

function buildMessages(userMessage, history) {
    const messages = [{ role: "system", content: SYSTEM_PROMPT }];

    if (Array.isArray(history)) {
        history
            .filter((item) => item && item.content)
            .slice(-8)
            .forEach((item) => {
                const role = item.role === "assistant" || item.role === "bot"
                    ? "assistant"
                    : "user";
                messages.push({
                    role,
                    content: String(item.content),
                });
            });
    }

    if (!messages.some((item) => item.role === "user" && item.content === userMessage)) {
        messages.push({
            role: "user",
            content: userMessage,
        });
    }

    return messages;
}

router.post("/chat", async (req, res) => {
    try {
        const userMessage = String(req.body.message || "").trim();

        if (!userMessage) {
            return res.status(400).json({
                reply: "Please type a question first.",
            });
        }

        const client = getHfClient();

        if (!client) {
            return res.status(500).json({
                reply: "Hugging Face API key is missing. Add HF_API_KEY to the backend .env file, then restart the server.",
            });
        }

        const model = getModelName();
        console.log("Using Hugging Face model:", model);

        const completion = await client.chat.completions.create({
            model,
            messages: buildMessages(userMessage, req.body.history),
            max_tokens: 300,
            temperature: 0.7,
        });

        const reply = completion?.choices?.[0]?.message?.content?.trim();

        if (!reply) {
            return res.status(502).json({
                reply: "Hugging Face did not return a reply. Check HF_API_KEY and that the token can call Inference Providers.",
            });
        }

        return res.json({ reply });
    } catch (error) {
        console.error("Chat route error:", error);

        const hfMessage =
            error?.error?.message ||
            error?.message ||
            "Hugging Face chat request failed.";

        return res.status(502).json({
            reply: `Hugging Face error: ${hfMessage}`,
        });
    }
});

module.exports = router;
