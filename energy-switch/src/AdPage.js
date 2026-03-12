import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function AdPage() {
    const navigate = useNavigate();

    return (
        <div className="ad-container">
            <div className="ad-card">
                <h1>⚡ Switch to Us & Save Electricity</h1>
                <p>
                    Join smart customers and lower your electricity bills with better
                    energy plans and smart automation.
                </p>

                <ul>
                    <li>💡 Save on your monthly bill</li>
                    <li>📊 Smarter energy usage</li>
                    <li>🌍 Better for your home and the planet</li>
                </ul>

                <button className="switch-btn" onClick={() => navigate("/form")}>
                    Switch to Us
                </button>
            </div>
        </div>
    );
}

export default AdPage;