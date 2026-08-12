import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TiltCard from "../components/TiltCard";
import ScrollReveal from "../components/ScrollReveal";
import AestheticConsole from "../components/AestheticConsole";
import "./ExploreDestinations.css";

function ExploreDestinations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const destinations = [
    {
      name: "Paris, France",
      desc: "Experience the romance of historic architecture, street bistros, and world-renowned art museums.",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
      category: "Cities",
      rating: "4.9",
      cost: "Premium"
    },
    {
      name: "Bali, Indonesia",
      desc: "Delve into serene beaches, volcanic mountains, scenic rice terraces, and mystical temples.",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      category: "Beaches",
      rating: "4.8",
      cost: "Budget"
    },
    {
      name: "Zermatt, Switzerland",
      desc: "Breathtaking views of the Matterhorn, alpine meadows, world-class skiing, and crisp air.",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      category: "Mountains",
      rating: "5.0",
      cost: "Premium"
    },
    {
      name: "Dubai, UAE",
      desc: "A futuristic skyline soaring over desert sands. Experience luxury shopping and record-breaking architecture.",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
      category: "Cities",
      rating: "4.7",
      cost: "Premium"
    },
    {
      name: "Kyoto, Japan",
      desc: "Step back in time through historic wooden houses, gardens, shinto shrines, and bamboo forests.",
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      category: "Cultural",
      rating: "4.9",
      cost: "Standard"
    },
    {
      name: "Reykjavik, Iceland",
      desc: "Explore geothermal geysers, majestic waterfalls, volcanic black sands, and look up at the dancing Aurora Borealis.",
      img: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80",
      category: "Mountains",
      rating: "4.9",
      cost: "Standard"
    }
  ];

  const categories = ["All", "Beaches", "Mountains", "Cities", "Cultural"];

  const filtered = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || dest.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handlePlanTrip = (destName) => {
    // Navigate to homepage quick matching with prefilled destination
    navigate("/", { state: { prefilledDestination: destName } });
  };

  return (
    <div className="explore-container">
      {/* Background Blobs */}
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <ScrollReveal className="explore-header">
        <span className="badge badge-indigo">Curated Escapes</span>
        <h1>Trending Destinations</h1>
        <p>Discover hand-picked places loved by adventure seekers around the globe.</p>
      </ScrollReveal>

      {/* Search & Filter Bar */}
      <ScrollReveal className="filter-bar glass-panel">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search by city or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Destinations Grid */}
      <ScrollReveal className="destinations-grid">
        {filtered.length > 0 ? (
          filtered.map((dest, idx) => (
            <TiltCard key={idx} maxTilt={8}>
              <div className="destination-card glass-panel" style={{ height: "100%" }}>
                <div className="dest-image-wrapper">
                  <img src={dest.img} alt={dest.name} loading="lazy" />
                  <span className="category-badge">{dest.category}</span>
                  <span className="rating-badge">★ {dest.rating}</span>
                </div>
                <div className="dest-content">
                  <h3>{dest.name}</h3>
                  <p>{dest.desc}</p>
                  <div className="dest-footer">
                    <span className="cost-indicator">Cost: <strong>{dest.cost}</strong></span>
                    <button className="btn btn-primary btn-sm" onClick={() => handlePlanTrip(dest.name)}>
                      Find Buddies
                    </button>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))
        ) : (
          <div className="no-destinations glass-panel">
            <h3>No Destinations Found</h3>
            <p>Try refining your search query or choosing another category.</p>
          </div>
        )}
      </ScrollReveal>

      <AestheticConsole />
    </div>
  );
}

export default ExploreDestinations;
