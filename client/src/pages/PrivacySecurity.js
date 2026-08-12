import { useState } from "react";
import ScrollReveal from "../components/ScrollReveal";
import AestheticConsole from "../components/AestheticConsole";
import Footer from "../components/Footer";
import "./PrivacySecurity.css";

function PrivacySecurity() {
  const [activeTab, setActiveTab] = useState("privacy");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Is my personal email address visible to other users?",
      a: "No. Your email address is strictly private. All initial coordination, itinerary sharing, and chat happen through AeroTravel's in-app chat."
    },
    {
      q: "Can I completely delete my profile and location history?",
      a: "Yes. AeroTravel gives you 100% data ownership. You can permanently delete your account, saved destinations, and match history with one click in your settings."
    },
    {
      q: "How does AeroTravel protect my data privacy?",
      a: "We use enterprise-grade AES-256 encryption at rest and TLS 1.3 in transit. We have a strict zero-data-selling guarantee — your information is never sold to 3rd-party advertisers."
    },
    {
      q: "How do I update my destination preferences?",
      a: "You can update your destination, budget range, and travel vibe anytime from your Dashboard under the My Preferences tab."
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="privacy-security-container">
      {/* Background Blobs */}
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      {/* Header Banner */}
      <ScrollReveal className="ps-header">
        <span className="badge badge-emerald">Legal & Policy Center</span>
        <h1>Privacy Policy & Terms of Service</h1>
        <p>
          Learn how AeroTravel handles data privacy, user account protection, and service guidelines.
        </p>

        {/* Quick Search */}
        <div className="ps-search-box glass-panel">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search privacy policies, terms, or FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>&times;</button>
          )}
        </div>
      </ScrollReveal>

      {/* Navigation Tabs */}
      <div className="ps-tabs-bar glass-panel">
        <button
          className={`ps-tab-btn ${activeTab === "privacy" ? "active" : ""}`}
          onClick={() => setActiveTab("privacy")}
        >
          📄 Privacy Policy
        </button>
        <button
          className={`ps-tab-btn ${activeTab === "terms" ? "active" : ""}`}
          onClick={() => setActiveTab("terms")}
        >
          📜 Terms of Service
        </button>
        <button
          className={`ps-tab-btn ${activeTab === "faq" ? "active" : ""}`}
          onClick={() => setActiveTab("faq")}
        >
          ❓ Help & Support FAQ
        </button>
      </div>

      {/* Tab 1: Privacy Policy */}
      {activeTab === "privacy" && (
        <ScrollReveal className="ps-policy-document glass-panel">
          <h2>AeroTravel Global Privacy Policy</h2>
          <span className="policy-date">Last Updated: August 12, 2026</span>

          <div className="policy-block">
            <h3>1. Information We Collect</h3>
            <p>
              We collect information you provide directly when creating your profile, including your display name, preferred destination, travel budget range, travel style vibe, and optional profile avatar.
            </p>
          </div>

          <div className="policy-block">
            <h3>2. How We Use Your Data</h3>
            <p>
              Your data is processed strictly to match you with compatible travel partners, display shared destination results, calculate cost-sharing estimates, and facilitate live socket messaging.
            </p>
          </div>

          <div className="policy-block">
            <h3>3. Zero Data-Selling Commitment</h3>
            <p>
              AeroTravel will never sell, rent, lease, or trade your personal information or trip preferences to third-party ad networks, brokers, or marketing firms.
            </p>
          </div>

          <div className="policy-block">
            <h3>4. Data Encryption & Storage</h3>
            <p>
              All password hashes are generated using industry-standard <code>bcrypt</code> algorithms. Database entries and session storage keys are protected under AES-256 encryption.
            </p>
          </div>

          <div className="policy-block">
            <h3>5. Data Erasure & Account Deletion</h3>
            <p>
              You maintain total data ownership. Deleting your account instantly purges your active matches, chat logs, profile data, and saved itineraries from our production database.
            </p>
          </div>
        </ScrollReveal>
      )}

      {/* Tab 2: Terms of Service */}
      {activeTab === "terms" && (
        <ScrollReveal className="ps-policy-document glass-panel">
          <h2>AeroTravel Terms of Service</h2>
          <span className="policy-date">Effective Date: August 12, 2026</span>

          <div className="policy-block">
            <h3>1. Code of Conduct</h3>
            <p>
              All members agree to treat travel companions with mutual respect, dignity, and cultural awareness. Harassment, discrimination, or aggressive behavior result in immediate account termination.
            </p>
          </div>

          <div className="policy-block">
            <h3>2. Financial Independence & Expenses</h3>
            <p>
              AeroTravel is a companion matching and itinerary planning platform. Users are solely responsible for their own travel expenditures, hotel bookings, flight tickets, and shared bill payments.
            </p>
          </div>

          <div className="policy-block">
            <h3>3. Intellectual Property</h3>
            <p>
              All design systems, 3D motion engines, branding, logo assets, and code logic are protected under copyright law created by Dipanjan Choudhuri.
            </p>
          </div>
        </ScrollReveal>
      )}

      {/* Tab 3: FAQ */}
      {activeTab === "faq" && (
        <ScrollReveal className="ps-faq-container">
          <h2>Frequently Asked Questions</h2>
          <p className="faq-subtitle">Everything you need to know about matching, privacy, and account settings.</p>

          <div className="faq-list">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item glass-panel ${openFaq === index ? "open" : ""}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="faq-question">
                  <h4>{faq.q}</h4>
                  <span className="faq-arrow">{openFaq === index ? "−" : "+"}</span>
                </div>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <p className="no-faq-msg">No matching topics found for "{searchQuery}". Try another keyword!</p>
            )}
          </div>
        </ScrollReveal>
      )}

      <Footer />
      <AestheticConsole />
    </div>
  );
}

export default PrivacySecurity;
