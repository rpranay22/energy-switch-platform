import { useState } from "react";

function FaqWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const faqs = [
        {
            question: "What is MPRN?",
            answer:
                "MPRN stands for Meter Point Reference Number. It is a unique number that identifies your electricity connection and is usually found on your electricity bill.",
        },
        {
            question: "Why do you need my Eircode?",
            answer:
                "We use your Eircode to identify your property location accurately during the switching and onboarding process.",
        },
        {
            question: "Where do I find my meter number?",
            answer:
                "Your meter number is usually printed on your electricity meter and may also appear on your electricity bill.",
        },
        {
            question: "What is meter reading?",
            answer:
                "Meter reading is the number currently displayed on your electricity meter. It helps ensure correct billing when switching suppliers.",
        },
        {
            question: "What is dynamic pricing?",
            answer:
                "Dynamic pricing means electricity prices can change depending on demand, supply, and market conditions. Customers may save by shifting usage to cheaper periods.",
        },
        {
            question: "How do I switch electricity provider?",
            answer:
                "You can switch by filling out the onboarding form with your personal details, Eircode, MPRN, and other electricity connection information.",
        },
        {
            question: "What happens after I submit my application?",
            answer:
                "After submission, your details are reviewed by the onboarding or sales team, and the next switching steps are initiated.",
        },
        {
            question: "Do I need my current electricity bill?",
            answer:
                "It is recommended because it usually contains your MPRN, meter number, and other important switching details.",
        },
        {
            question: "Is Eircode mandatory?",
            answer:
                "Yes, Eircode is important because it helps identify the correct service location during onboarding.",
        },
        {
            question: "Is MPRN mandatory?",
            answer:
                "Yes, MPRN is usually required because it uniquely identifies your electricity connection.",
        },
        {
            question: "Can I switch without a smart meter?",
            answer:
                "Yes, switching is still possible even if you do not currently have a smart meter, depending on supplier requirements.",
        },
        {
            question: "What if I do not know my meter reading?",
            answer:
                "You can check your electricity meter directly or refer to your latest electricity bill for recent readings.",
        },
        {
            question: "What if I enter the wrong details?",
            answer:
                "Incorrect details may delay the switching process, so it is important to review your form carefully before submitting.",
        },
        {
            question: "Why do you collect my address?",
            answer:
                "Your address helps verify your property and supports the switching and onboarding process along with your Eircode.",
        },
        {
            question: "What is the difference between meter number and MPRN?",
            answer:
                "MPRN identifies the electricity connection, while meter number identifies the physical meter installed at the property.",
        },
        {
            question: "Will switching interrupt my electricity supply?",
            answer:
                "In most cases, switching supplier does not interrupt your electricity supply because only the billing relationship changes.",
        },
        {
            question: "How long does switching take?",
            answer:
                "Switching timelines depend on the supplier and verification process, but it usually takes a few working days to complete.",
        },
        {
            question: "Can I track my application?",
            answer:
                "For the prototype, this feature is not included yet, but in a production system users could track their onboarding status in the app.",
        },
        {
            question: "Why do you ask for my current provider?",
            answer:
                "Your current provider information helps support the switching process and ensures correct transfer of service details.",
        },
        {
            question: "Do I need to upload documents?",
            answer:
                "For the prototype, document upload is optional, but in real systems suppliers may request a recent electricity bill or identity verification.",
        },
        {
            question: "Can I choose a payment method?",
            answer:
                "Yes, users may be able to select payment preferences such as direct debit or other supported payment methods.",
        },
        {
            question: "What is preferred contact time?",
            answer:
                "Preferred contact time allows you to indicate when the onboarding team can best reach you.",
        },
        {
            question: "Can the chatbot help me complete the form?",
            answer:
                "Yes, the chatbot is designed to answer common onboarding questions and guide users through the required fields.",
        },
        {
            question: "How can dynamic pricing help me save money?",
            answer:
                "Dynamic pricing can help reduce electricity costs if you shift flexible usage, such as appliances or EV charging, to lower-price periods.",
        },
        {
            question: "Is my data saved securely?",
            answer:
                "In this prototype, form data is captured for demonstration purposes. In a production system, customer data would be securely stored and protected.",
        },
    ];

    return (
        <>
            <button className="faq-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                ❓
            </button>

            {isOpen && (
                <div className="faq-container">
                    <div className="faq-header">
                        <h3>FAQs</h3>
                        <button onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <div className="faq-content">
                        {faqs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <strong>{faq.question}</strong>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default FaqWidget;