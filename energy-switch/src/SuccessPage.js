
function SuccessPage({ customer, onBackHome }) {
    const fullLocation = `${customer?.address || ""} ${customer?.eircode || ""}`.trim();
    const encodedLocation = encodeURIComponent(fullLocation || "Ireland");

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-10.8%2C51.3%2C-5.3%2C55.5&layer=mapnik&marker=53.35%2C-6.26`;
    const searchMapUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;

    return (
        <div className="success-page">
            <div className="success-card success-map-card">
                <div className="success-icon">✅</div>

                <h1>Application Submitted Successfully</h1>

                <p>
                    Thank you, <strong>{customer?.firstName || "Customer"}</strong>. Your
                    application has been submitted successfully. Our team will review your
                    request and contact you soon.
                </p>

                <div className="customer-summary">
                    <div><strong>Name:</strong> {customer?.firstName} {customer?.lastName}</div>
                    <div><strong>Email:</strong> {customer?.email}</div>
                    <div><strong>Phone:</strong> {customer?.phone}</div>
                    <div><strong>Eircode:</strong> {customer?.eircode}</div>
                    <div><strong>Address:</strong> {customer?.address || "Not provided"}</div>
                    <div><strong>Provider:</strong> {customer?.provider}</div>
                </div>

                <div className="map-wrapper">
                    <h3>Customer Location</h3>

                    {fullLocation ? (
                        <iframe
                            title="Customer Location Map"
                            src={searchMapUrl}
                            width="100%"
                            height="320"
                            style={{ border: 0, borderRadius: "16px" }}
                            loading="lazy"
                            allowFullScreen
                        />
                    ) : (
                        <iframe
                            title="Default Ireland Map"
                            src={mapUrl}
                            width="100%"
                            height="320"
                            style={{ border: 0, borderRadius: "16px" }}
                            loading="lazy"
                        />
                    )}
                </div>

                <button className="switch-btn" onClick={onBackHome}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default SuccessPage;