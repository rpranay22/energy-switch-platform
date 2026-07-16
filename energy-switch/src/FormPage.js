import { useState } from "react";

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
        meterNumber: "",
        meterReading: "",
        paymentMethod: "",
        preferredContactTime: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const providers = [
        "Electric Ireland",
        "SSE Airtricity",
        "Bord Gáis Energy",
        "PrepayPower",
        "Energia",
        "Other",
    ];

    const paymentMethods = [
        "Direct Debit",
        "Card",
        "Pay As You Go",
        "Other",
    ];

    const contactTimes = [
        "Morning",
        "Afternoon",
        "Evening",
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
                "http://localhost:5002/api/createCustomer",
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
                            Current Electricity Provider *
                        </label>

                        <select
                            id="provider"
                            name="provider"
                            value={formData.provider}
                            onChange={handleChange}
                            required
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

                    <div className="field-group">
                        <label htmlFor="meterNumber">
                            Meter Number
                        </label>

                        <input
                            id="meterNumber"
                            type="text"
                            name="meterNumber"
                            value={formData.meterNumber}
                            onChange={handleChange}
                            placeholder="Enter meter number"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="meterReading">
                            Current Meter Reading
                        </label>

                        <input
                            id="meterReading"
                            type="text"
                            name="meterReading"
                            value={formData.meterReading}
                            onChange={handleChange}
                            placeholder="Enter meter reading"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="paymentMethod">
                            Payment Method
                        </label>

                        <select
                            id="paymentMethod"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select payment method
                            </option>

                            {paymentMethods.map((method) => (
                                <option
                                    key={method}
                                    value={method}
                                >
                                    {method}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field-group">
                        <label htmlFor="preferredContactTime">
                            Preferred Contact Time
                        </label>

                        <select
                            id="preferredContactTime"
                            name="preferredContactTime"
                            value={formData.preferredContactTime}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select preferred contact time
                            </option>

                            {contactTimes.map((time) => (
                                <option
                                    key={time}
                                    value={time}
                                >
                                    {time}
                                </option>
                            ))}
                        </select>
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