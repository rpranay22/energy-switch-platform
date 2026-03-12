import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function SuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const firstName = location.state?.firstName || "Customer";
    const addressLine1 = location.state?.addressLine1 || "";
    const addressLine2 = location.state?.addressLine2 || "";
    const city = location.state?.city || "";
    const county = location.state?.county || "";
    const eircode = location.state?.eircode || "";

    const fullAddress = [
        addressLine1,
        addressLine2,
        city,
        county,
        eircode,
        "Ireland"
    ]
        .filter(Boolean)
        .join(", ");

    const [mapCenter, setMapCenter] = useState([53.3498, -6.2603]);
    const [loading, setLoading] = useState(true);
    const [geoError, setGeoError] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        if (!fullAddress) {
            setGeoError("No address was provided.");
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchCoordinates = async () => {
            try {
                const query = encodeURIComponent(fullAddress);

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=ie&limit=1&q=${query}`,
                    {
                        signal: controller.signal,
                        headers: {
                            "Accept-Language": "en"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch map location");
                }

                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    const result = data[0];
                    const countryCode = result.address?.country_code?.toLowerCase();

                    if (countryCode === "ie") {
                        setMapCenter([parseFloat(result.lat), parseFloat(result.lon)]);
                        setDisplayName(result.display_name || fullAddress);
                        setShowMap(true);
                    } else {
                        setGeoError("The submitted address could not be confirmed in Ireland.");
                    }
                } else {
                    setGeoError("We could not find the exact location for this address.");
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Geocoding error:", error);
                    setGeoError("Unable to load the map for this address.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCoordinates();

        return () => controller.abort();
    }, [fullAddress]);

    return (
        <div className="success-page">
            <div className="success-card">
                <h1>✅ Application Submitted Successfully</h1>

                <p>
                    Thank you, {firstName}. We have received your application and
                    we will get back to you shortly.
                </p>

                <div className="success-info">
                    <p><strong>Submitted Address:</strong> {fullAddress}</p>
                </div>

                <div className="map-wrapper">
                    {loading ? (
                        <p>Loading customer location...</p>
                    ) : showMap ? (
                        <>
                            <p className="map-note">Approximate location based on submitted address.</p>

                            <MapContainer
                                center={mapCenter}
                                zoom={15}
                                scrollWheelZoom={false}
                                style={{ height: "350px", width: "100%", borderRadius: "16px" }}
                            >
                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={mapCenter}>
                                    <Popup>{displayName}</Popup>
                                </Marker>
                            </MapContainer>
                        </>
                    ) : (
                        <div className="location-error-box">
                            <p>{geoError}</p>
                            <p>
                                Your application has still been submitted successfully.
                                Our team will review the address details and contact you soon.
                            </p>
                        </div>
                    )}
                </div>

                <button className="back-home-btn" onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default SuccessPage;