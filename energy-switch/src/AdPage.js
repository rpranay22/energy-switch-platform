
function AdPage({ onSwitch }) {
    return (
        <div className="ad-container">
            <div className="ad-card">
                <div className="badge">Smart Electricity Switching</div>

                <h1>⚡ Switch to Us & Save on Electricity</h1>

                <p className="ad-subtitle">
                    Make your electricity smarter with dynamic pricing, easier switching,
                    and a simpler onboarding experience.
                </p>

                <div className="ad-features">
                    <div className="feature-box">💡 Save up to 30% on bills</div>
                    <div className="feature-box">📊 Smarter energy management</div>
                    <div className="feature-box">🌍 Cleaner, efficient usage</div>
                </div>

                <button className="switch-btn" onClick={onSwitch}>
                    Switch to Us
                </button>
            </div>
        </div>
    );
}

export default AdPage;