import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function FormPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        addressSearch: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        county: "",
        eircode: "",
        provider: "",
        mprn: "",
        meterNumber: "",
        meterReading: ""
    });

    const [errors, setErrors] = useState({});
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [countySuggestions, setCountySuggestions] = useState([]);
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
    const [showCountySuggestions, setShowCountySuggestions] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [countyLoading, setCountyLoading] = useState(false);

    const addressRef = useRef(null);
    const countyRef = useRef(null);

    const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "addressLine1",
        "city",
        "county",
        "eircode",
        "provider",
        "mprn"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const validate = () => {
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field] || !formData[field].trim()) {
                newErrors[field] = "This field is required";
            }
        });

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (formData.phone && !/^[0-9+\s()-]{7,20}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addressRef.current && !addressRef.current.contains(event.target)) {
                setShowAddressSuggestions(false);
            }
            if (countyRef.current && !countyRef.current.contains(event.target)) {
                setShowCountySuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const query = formData.addressSearch.trim();

        if (query.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            try {
                setAddressLoading(true);

                const url =
                    `https://nominatim.openstreetmap.org/search?` +
                    `format=jsonv2&addressdetails=1&countrycodes=ie&limit=6&q=${encodeURIComponent(
                        `${query}, Ireland`
                    )}`;

                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        "Accept-Language": "en"
                    }
                });

                const data = await response.json();

                setAddressSuggestions(Array.isArray(data) ? data : []);
                setShowAddressSuggestions(true);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Address lookup failed:", error);
                }
            } finally {
                setAddressLoading(false);
            }
        }, 450);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [formData.addressSearch]);

    useEffect(() => {
        const query = formData.county.trim();

        if (query.length < 2) {
            setCountySuggestions([]);
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            try {
                setCountyLoading(true);

                const url =
                    `https://nominatim.openstreetmap.org/search?` +
                    `format=jsonv2&addressdetails=1&countrycodes=ie&limit=8&q=${encodeURIComponent(
                        `County ${query}, Ireland`
                    )}`;

                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        "Accept-Language": "en"
                    }
                });

                const data = await response.json();

                const uniqueCountyMap = new Map();

                (Array.isArray(data) ? data : []).forEach((item) => {
                    const countyName =
                        item?.address?.county ||
                        item?.address?.state_district ||
                        item?.name ||
                        "";

                    if (countyName) {
                        const key = countyName.toLowerCase();
                        if (!uniqueCountyMap.has(key)) {
                            uniqueCountyMap.set(key, countyName);
                        }
                    }
                });

                setCountySuggestions(Array.from(uniqueCountyMap.values()));
                setShowCountySuggestions(true);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("County lookup failed:", error);
                }
            } finally {
                setCountyLoading(false);
            }
        }, 350);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [formData.county]);

    const handleAddressSuggestionClick = (item) => {
        const address = item.address || {};

        const houseNumber = address.house_number || "";
        const road = address.road || "";
        const suburb =
            address.suburb ||
            address.neighbourhood ||
            address.residential ||
            "";
        const city =
            address.city ||
            address.town ||
            address.village ||
            address.hamlet ||
            "";
        const county =
            address.county ||
            address.state_district ||
            "";
        const postcode = address.postcode || "";

        const line1 = [houseNumber, road].filter(Boolean).join(" ").trim();
        const line2 = suburb;

        setFormData((prev) => ({
            ...prev,
            addressSearch: item.display_name || "",
            addressLine1: line1 || prev.addressLine1,
            addressLine2: line2 || prev.addressLine2,
            city: city || prev.city,
            county: county || prev.county,
            eircode: postcode || prev.eircode
        }));

        setShowAddressSuggestions(false);
        setAddressSuggestions([]);
    };

    const handleCountySuggestionClick = (countyName) => {
        setFormData((prev) => ({
            ...prev,
            county: countyName
        }));

        setShowCountySuggestions(false);
        setCountySuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const response = await fetch("http://localhost:5000/api/createCustomer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to save customer");
            }

            await response.json();

            navigate("/success", {
                state: {
                    firstName: formData.firstName,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    county: formData.county,
                    eircode: formData.eircode
                }
            });
        } catch (error) {
            console.error("Submit error:", error);
            alert("Unable to submit application. Please try again.");
        }
    };

    return (
        <div className="form-page-bg">
            <div className="form-container">
                <h1 className="form-title">Switch Your Electricity in Minutes</h1>
                <p className="form-subtitle">
                    Enter your details below and our team will contact you with the best plan.
                </p>

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="field-wrap">
                        <label>First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                        />
                        {errors.firstName && <span className="error">{errors.firstName}</span>}
                    </div>

                    <div className="field-wrap">
                        <label>Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                        />
                        {errors.lastName && <span className="error">{errors.lastName}</span>}
                    </div>

                    <div className="field-wrap">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="field-wrap">
                        <label>Phone Number *</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />
                        {errors.phone && <span className="error">{errors.phone}</span>}
                    </div>

                    <div className="field-wrap full-width" ref={addressRef}>
                        <label>Search Address *</label>
                        <input
                            type="text"
                            name="addressSearch"
                            value={formData.addressSearch}
                            onChange={handleChange}
                            onFocus={() => {
                                if (addressSuggestions.length > 0) setShowAddressSuggestions(true);
                            }}
                            placeholder="Start typing your address"
                            autoComplete="off"
                        />

                        {addressLoading && <div className="hint-text">Searching address...</div>}

                        {showAddressSuggestions && addressSuggestions.length > 0 && (
                            <div className="suggestions-box">
                                {addressSuggestions.map((item) => (
                                    <div
                                        key={item.place_id}
                                        className="suggestion-item"
                                        onClick={() => handleAddressSuggestionClick(item)}
                                    >
                                        {item.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="field-wrap">
                        <label>Address Line 1 *</label>
                        <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            placeholder="House number and street"
                        />
                        {errors.addressLine1 && <span className="error">{errors.addressLine1}</span>}
                    </div>

                    <div className="field-wrap">
                        <label>Address Line 2</label>
                        <input
                            type="text"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            placeholder="Apartment, area, landmark"
                        />
                    </div>

                    <div className="field-wrap">
                        <label>City / Town *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter city or town"
                        />
                        {errors.city && <span className="error">{errors.city}</span>}
                    </div>

                    <div className="field-wrap" ref={countyRef}>
                        <label>County *</label>
                        <input
                            type="text"
                            name="county"
                            value={formData.county}
                            onChange={handleChange}
                            onFocus={() => {
                                if (countySuggestions.length > 0) setShowCountySuggestions(true);
                            }}
                            placeholder="Start typing county"
                            autoComplete="off"
                        />
                        {countyLoading && <div className="hint-text">Searching counties...</div>}
                        {errors.county && <span className="error">{errors.county}</span>}

                        {showCountySuggestions && countySuggestions.length > 0 && (
                            <div className="suggestions-box">
                                {countySuggestions.map((countyName, index) => (
                                    <div
                                        key={`${countyName}-${index}`}
                                        className="suggestion-item"
                                        onClick={() => handleCountySuggestionClick(countyName)}
                                    >
                                        {countyName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="field-wrap">
                        <label>Eircode *</label>
                        <input
                            type="text"
                            name="eircode"
                            value={formData.eircode}
                            onChange={handleChange}
                            placeholder="Enter Eircode"
                        />
                        {errors.eircode && <span className="error">{errors.eircode}</span>}
                    </div>

                    <div className="field-wrap">
                        <label>Current Electricity Provider *</label>
                        <input
                            type="text"
                            name="provider"
                            value={formData.provider}
                            onChange={handleChange}
                            placeholder="Enter provider name"
                        />
                        {errors.provider && <span className="error">{errors.provider}</span>}
                    </div>

                    <div className="field-wrap">
                        <label>MPRN *</label>
                        <input
                            type="text"
                            name="mprn"
                            value={formData.mprn}
                            onChange={handleChange}
                            placeholder="Enter MPRN"
                        />
                        {errors.mprn && <span className="error">{errors.mprn}</span>}
                    </div>

                    <div className="field-wrap">
                        <label>Meter Number</label>
                        <input
                            type="text"
                            name="meterNumber"
                            value={formData.meterNumber}
                            onChange={handleChange}
                            placeholder="Enter meter number"
                        />
                    </div>

                    <div className="field-wrap">
                        <label>Current Meter Reading</label>
                        <input
                            type="text"
                            name="meterReading"
                            value={formData.meterReading}
                            onChange={handleChange}
                            placeholder="Enter meter reading"
                        />
                    </div>

                    <div className="full-width">
                        <button type="submit" className="submit-btn">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormPage;