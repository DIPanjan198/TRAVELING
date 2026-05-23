import "./ExploreDestinations.css";

function ExploreDestinations() {
  const destinations = [
    {
      name: "Paris",
      desc: "Romantic city of lights & culture",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    },
    {
      name: "Bali",
      desc: "Tropical paradise & serene beaches",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      name: "Switzerland",
      desc: "Snowy mountains & scenic landscapes",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
    {
      name: "Dubai",
      desc: "Luxury, innovation & skyline views",
      img: "https://images.unsplash.com/photo-1498496294664-d9372eb521f3",
    },
  ];

  return (
    <div className="explore-bg">
      <div className="explore-header">
        <h2>🌍 Explore Destinations</h2>
        <p>Hand-picked destinations loved by travelers worldwide</p>
      </div>

      <div className="destination-grid">
        {destinations.map((place, index) => (
          <div
            className="destination-card"
            style={{ animationDelay: `${index * 0.15}s` }}
            key={index}
          >
            <div className="image-wrapper">
              <img src={place.img} alt={place.name} />
            </div>
            <div className="card-content">
              <h3>{place.name}</h3>
              <p>{place.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreDestinations;
