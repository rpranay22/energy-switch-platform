const fieldExplanations = [
    {
        id: "firstName",
        label: "First Name",
        answer:
            "Enter your legal first name as it appears on your electricity bill. We use this to register the switch in the correct customer name.",
    },
    {
        id: "lastName",
        label: "Last Name",
        answer:
            "Enter your surname as it appears on your electricity account. Matching the bill name helps us complete the supplier transfer without delays.",
    },
    {
        id: "email",
        label: "Email",
        answer:
            "Use an email address you check regularly. We send your application confirmation and switching updates here.",
    },
    {
        id: "phone",
        label: "Phone Number",
        answer:
            "Provide a number we can reach you on, preferably a mobile. Our onboarding team may call or text to confirm details or next steps.",
    },
    {
        id: "eircode",
        label: "Eircode",
        answer:
            "An Eircode is Ireland’s 7-character postcode (for example D02 AF30). It identifies your property so we switch the correct electricity connection. You can find it on your bill or at finder.eircode.ie.",
    },
    {
        id: "address",
        label: "Address",
        answer:
            "Enter the street address of the property you want to switch. Together with your Eircode, this confirms we are transferring supply at the right location.",
    },
    {
        id: "provider",
        label: "Current Electricity Provider",
        answer:
            "Select the company that currently supplies your electricity, such as Electric Ireland or SSE Airtricity. We need this to request the transfer from the correct supplier.",
    },
    {
        id: "mprn",
        label: "MPRN",
        answer:
            "MPRN stands for Meter Point Reference Number. It is an 11-digit number that uniquely identifies your electricity connection, not the physical meter. It is printed on your bill, usually near the supply address.",
    },
    {
        id: "meterNumber",
        label: "Meter Number",
        answer:
            "This is the serial number printed on the meter itself, and it often also appears on your bill. It identifies the physical meter at your property and is different from the MPRN.",
    },
    {
        id: "meterReading",
        label: "Current Meter Reading",
        answer:
            "Enter the numbers currently shown on your electricity meter. We use this as the opening or closing reading so your old and new suppliers bill you fairly when you switch.",
    },
    {
        id: "paymentMethod",
        label: "Payment Method",
        answer:
            "Choose how you prefer to pay after switching: Direct Debit, Card, Pay As You Go, or Other. This is used to set up billing with the new supplier.",
    },
    {
        id: "preferredContactTime",
        label: "Preferred Contact Time",
        answer:
            "Choose morning, afternoon, or evening so our team can contact you at a time that suits you if we need to follow up on your application.",
    },
];

export function getFieldExplanation(id) {
    return fieldExplanations.find((field) => field.id === id)?.answer || "";
}

export default fieldExplanations;
