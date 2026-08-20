const fieldExplanations = [
    {
        id: "provider",
        label: "Current Electricity Provider",
        answer:
            "We collect your current supplier so we know who to request the transfer from and can move your account to us without interrupting supply.",
    },
    {
        id: "mprn",
        label: "MPRN",
        answer:
            "We collect your MPRN because it uniquely identifies your electricity connection. We need it to switch the correct meter point with the network operator.",
    },
];

export function getFieldExplanation(id) {
    return fieldExplanations.find((field) => field.id === id)?.answer || "";
}

export default fieldExplanations;
