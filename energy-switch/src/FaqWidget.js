import { useState } from "react";
import fieldExplanations from "./fieldExplanations";

function FaqWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button className="faq-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                ❓
            </button>

            {isOpen && (
                <div className="faq-container">
                    <div className="faq-header">
                        <h3>Form field help</h3>
                        <button onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <div className="faq-content">
                        {fieldExplanations.map((field) => (
                            <div key={field.id} className="faq-item">
                                <strong>{field.label}</strong>
                                <p>{field.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default FaqWidget;
