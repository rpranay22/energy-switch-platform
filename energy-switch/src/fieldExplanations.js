const fieldExplanations = [
    {
        id: "firstName",
        label: "First Name",
        answer:
            "We collect your first name so the electricity switch is registered to the correct person and matches the name on your current account.",
    },
    {
        id: "lastName",
        label: "Last Name",
        answer:
            "We collect your surname so we can match your application to your existing electricity account and complete the transfer without delays.",
    },
    {
        id: "email",
        label: "Email",
        answer:
            "We collect your email to send confirmation of your application and keep you updated on the progress of your switch.",
    },
    {
        id: "phone",
        label: "Phone Number",
        answer:
            "We collect your phone number so our onboarding team can contact you if we need to confirm details or arrange the next steps of your switch.",
    },
    {
        id: "eircode",
        label: "Eircode",
        answer:
            "We collect your Eircode to identify the exact property being switched, so supply is transferred at the right location and not a neighbouring address.",
    },
    {
        id: "address",
        label: "Address",
        answer:
            "We collect your address to verify the property location alongside your Eircode and to complete the supplier transfer for the correct premises.",
    },
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
    {
        id: "meterNumber",
        label: "Meter Number",
        answer:
            "We collect your meter number to confirm the physical meter at your property, which helps us verify the connection we are switching.",
    },
    {
        id: "meterReading",
        label: "Current Meter Reading",
        answer:
            "We collect your current meter reading so your old and new suppliers can bill you fairly from the date of the switch, with no overlap or gap.",
    },
    {
        id: "paymentMethod",
        label: "Payment Method",
        answer:
            "We collect your preferred payment method so we can set up billing correctly after you switch, according to how you want to pay.",
    },
    {
        id: "preferredContactTime",
        label: "Preferred Contact Time",
        answer:
            "We collect your preferred contact time so we only call you during the part of the day that suits you if we need to follow up.",
    },
];

export function getFieldExplanation(id) {
    return fieldExplanations.find((field) => field.id === id)?.answer || "";
}

export default fieldExplanations;
