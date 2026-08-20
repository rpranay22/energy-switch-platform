import fieldExplanations from "./fieldExplanations";

const extraAnswers = [
    {
        keywords: ["dynamic pricing", "dynamic price", "cheaper periods"],
        answer:
            "Dynamic pricing means electricity prices can change during the day based on demand and supply. You can save by using more electricity when prices are lower, such as running appliances or charging an EV overnight.",
    },
    {
        keywords: ["after i submit", "after submit", "what happens after", "next steps"],
        answer:
            "After you submit, your details are saved as a lead. Our onboarding team reviews them and starts the switch with your current supplier. We will contact you by email or phone if we need anything else.",
    },
    {
        keywords: ["how do i switch", "how to switch", "switching process", "switch provider"],
        answer:
            "Fill in the onboarding form with your name, contact details, Eircode, current provider, and MPRN. We use those details to request the transfer. Your electricity supply should stay on while the account moves to us.",
    },
    {
        keywords: ["interrupt", "cut off", "power cut", "supply stay on"],
        answer:
            "Switching supplier should not cut off your electricity. Only the company that bills you changes. The same connection and meter stay in place.",
    },
    {
        keywords: ["how long", "how many days", "timeline"],
        answer:
            "Most switches take a few working days after we verify your MPRN and account details. We will update you by email if it takes longer or if we need more information.",
    },
    {
        keywords: ["where do i find mprn", "find my mprn", "where is mprn"],
        answer:
            "Your MPRN is an 11-digit number on your electricity bill, usually near the supply address. We need it to switch the correct electricity connection.",
    },
    {
        keywords: ["electricity bill", "need my bill"],
        answer:
            "A recent electricity bill is useful because it usually has your MPRN, Eircode, and account name. Those details help us switch the correct account and property.",
    },
];

const fieldKeywordMap = [
    { id: "provider", keywords: ["provider", "supplier", "current electricity"] },
    { id: "mprn", keywords: ["mprn", "meter point"] },
];

function scoreKeywords(text, keywords) {
    return keywords.reduce((score, keyword) => {
        return text.includes(keyword) ? score + keyword.length : score;
    }, 0);
}

export function getChatReply(message) {
    const text = String(message || "").toLowerCase().trim();

    if (!text) {
        return "Please type a question about the onboarding form, such as why we need your MPRN or current provider.";
    }

    let bestAnswer = "";
    let bestScore = 0;

    extraAnswers.forEach((item) => {
        const score = scoreKeywords(text, item.keywords);
        if (score > bestScore) {
            bestScore = score;
            bestAnswer = item.answer;
        }
    });

    fieldKeywordMap.forEach((item) => {
        const score = scoreKeywords(text, item.keywords);
        if (score > bestScore) {
            const field = fieldExplanations.find((entry) => entry.id === item.id);
            if (field) {
                bestScore = score;
                bestAnswer = field.answer;
            }
        }
    });

    if (bestScore > 0) {
        return bestAnswer;
    }

    return "I can help with the onboarding form. Ask why we collect your current provider or MPRN.";
}
