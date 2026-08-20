import { useEffect, useRef, useState } from "react";
import { getFieldExplanation } from "./fieldExplanations";

function FieldHelp({ fieldId, openId, setOpenId }) {
    const helpRef = useRef(null);
    const isOpen = openId === fieldId;
    const explanation = getFieldExplanation(fieldId);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setOpenId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setOpenId]);

    return (
        <span className="field-help" ref={helpRef}>
            <button
                type="button"
                className="field-help-btn"
                aria-label={`Explain ${fieldId}`}
                onClick={() => setOpenId(isOpen ? null : fieldId)}
            >
                ?
            </button>

            {isOpen && (
                <span className="field-help-popup" role="tooltip">
                    {explanation}
                </span>
            )}
        </span>
    );
}

function FormPage({ onSuccess }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        eircode: "",
        address: "",
        provider: "",
        mprn: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openHelpId, setOpenHelpId] = useState(null);

    const providers = [
        "Electric Ireland",
        "SSE Airtricity",
        "Bord Gáis Energy",
        "PrepayPower",
        "Energia",
        "Other",
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        setErrorMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setErrorMessage("");

            /*
              Use this deployed Render URL when your updated backend
              has the POST /api/customers route.
            */
            const response = await fetch(
                "https://ui-dev-backend.onrender.com/api/createCustomer",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json().catch(() => ({
                error: "The server returned an invalid response.",
            }));

            console.log("Customer API response:", data);

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    data?.message ||
                    "Failed to save customer details."
                );
            }

            /*
              The backend response is expected to be:
      
              {
                message: "Lead created successfully",
                data: { customer details }
              }
      
              Pass the saved database record to SuccessPage.
              If data.data is missing, use the submitted form data.
            */
            const savedCustomer = data?.data || formData;

            onSuccess(savedCustomer);
        } catch (error) {
            console.error("Customer submission error:", error);

            setErrorMessage(
                error.message ||
                "Submission failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page-wrapper">
            <div className="form-container">
                <h1>Customer Onboarding Form</h1>

                <p className="form-subtitle">
                    Please enter your details to begin the switching
                    process.
                </p>

                {errorMessage && (
                    <div className="form-error-message">
                        {errorMessage}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="form-grid"
                >
                    <div className="field-group">
                        <label htmlFor="firstName">
                            First Name *
                        </label>

                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Enter first name"
                            autoComplete="given-name"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="lastName">
                            Last Name *
                        </label>

                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Enter last name"
                            autoComplete="family-name"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="email">
                            Email *
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                            autoComplete="email"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="phone">
                            Phone Number *
                        </label>

                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter phone number"
                            autoComplete="tel"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="eircode">
                            Eircode *
                        </label>

                        <input
                            id="eircode"
                            type="text"
                            name="eircode"
                            value={formData.eircode}
                            onChange={handleChange}
                            required
                            placeholder="Enter Eircode"
                            autoComplete="postal-code"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="address">
                            Address
                        </label>

                        <input
                            id="address"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                            autoComplete="street-address"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="provider">
                            Current Electricity Provider
                            <FieldHelp
                                fieldId="provider"
                                openId={openHelpId}
                                setOpenId={setOpenHelpId}
                            />
                        </label>

                        <select
                            id="provider"
                            name="provider"
                            value={formData.provider}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select provider
                            </option>

                            {providers.map((provider) => (
                                <option
                                    key={provider}
                                    value={provider}
                                >
                                    {provider}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field-group">
                        <label htmlFor="mprn">
                            MPRN *
                            <FieldHelp
                                fieldId="mprn"
                                openId={openHelpId}
                                setOpenId={setOpenHelpId}
                            />
                        </label>

                        <input
                            id="mprn"
                            type="text"
                            name="mprn"
                            value={formData.mprn}
                            onChange={handleChange}
                            required
                            placeholder="Enter MPRN"
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-btn premium-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FormPage;