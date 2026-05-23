import "./Features.css";

function Features() {
  const features = [
    {
      icon: "🌍",
      title: "Destination Matching",
      desc: "Find travelers heading to the same destination."
    },
    {
      icon: "🎒",
      title: "Travel Preferences",
      desc: "Match by travel style and interests."
    },
    {
      icon: "💰",
      title: "Budget Matching",
      desc: "Connect with people sharing similar budgets."
    },
    {
      icon: "🤝",
      title: "Verified Profiles",
      desc: "Travel confidently with trusted users."
    },
    {
      icon: "💬",
      title: "Live Chat",
      desc: "Plan trips together before you travel."
    },
    {
      icon: "🗺️",
      title: "Explore Destinations",
      desc: "Discover amazing places around the world."
    }
  ];

  return (
    <div className="features-page">
      <section className="features-hero">
        <h1>✨ TravelBuddy Features</h1>
        <p>
          Everything you need to find, connect and travel
          with amazing people.
        </p>
      </section>

      <section className="features-grid">
        {features.map((feature, index) => (
          <div
            className="feature-box"
            key={index}
          >
            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Features;