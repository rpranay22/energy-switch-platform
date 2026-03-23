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

    const providers = [
        "Electric Ireland",
        "SSE Airtricity",
        "Bord Gáis Energy",
        "PrepayPower",
        "Energia",
        "Other",
    ];

    const paymentMethods = ["Direct Debit", "Card", "Pay As You Go", "Other"];
    const contactTimes = ["Morning", "Afternoon", "Evening"];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch("http://localhost:5000/api/createCustomer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("Saved customer:", data);

            if (!response.ok) {
                throw new Error(data?.error || "Failed to save customer");
            }

            onSuccess(formData);
        } catch (error) {
            console.error(error);
            alert("Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page-wrapper">
            <div className="form-container">
                <h1>Customer Onboarding Form</h1>
                <p className="form-subtitle">
                    Please enter your details to begin the switching process.
                </p>

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="field-group">
                        <label>First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Enter first name"
                        />
                    </div>

                    <div className="field-group">
                        <label>Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Enter last name"
                        />
                    </div>

                    <div className="field-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="field-group">
                        <label>Phone Number *</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="field-group">
                        <label>Eircode *</label>
                        <input
                            type="text"
                            name="eircode"
                            value={formData.eircode}
                            onChange={handleChange}
                            required
                            placeholder="Enter Eircode"
                        />
                    </div>

                    <div className="field-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                        />
                    </div>

                    <div className="field-group">
                        <label>Current Electricity Provider *</label>
                        <select
                            name="provider"
                            value={formData.provider}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select provider</option>
                            {providers.map((provider) => (
                                <option key={provider} value={provider}>
                                    {provider}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field-group">
                        <label>MPRN *</label>
                        <input
                            type="text"
                            name="mprn"
                            value={formData.mprn}
                            onChange={handleChange}
                            required
                            placeholder="Enter MPRN"
                        />
                    </div>

                    <div className="field-group">
                        <label>Meter Number</label>
                        <input
                            type="text"
                            name="meterNumber"
                            value={formData.meterNumber}
                            onChange={handleChange}
                            placeholder="Enter meter number"
                        />
                    </div>

                    <div className="field-group">
                        <label>Current Meter Reading</label>
                        <input
                            type="text"
                            name="meterReading"
                            value={formData.meterReading}
                            onChange={handleChange}
                            placeholder="Enter meter reading"
                        />
                    </div>

                    <div className="field-group">
                        <label>Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="">Select payment method</option>
                            {paymentMethods.map((method) => (
                                <option key={method} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field-group">
                        <label>Preferred Contact Time</label>
                        <select
                            name="preferredContactTime"
                            value={formData.preferredContactTime}
                            onChange={handleChange}
                        >
                            <option value="">Select preferred contact time</option>
                            {contactTimes.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FormPage;