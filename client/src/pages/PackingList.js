import { useState } from "react";
import "./PackingList.css";

const PRESET_CATEGORIES = {
  "👕 Clothing": ["T-shirts (5)", "Pants / Jeans (2)", "Underwear (7)", "Socks (7)", "Jacket / Hoodie", "Formal shirt (1)", "Pyjamas", "Swimwear"],
  "🧴 Toiletries": ["Toothbrush & toothpaste", "Shampoo & conditioner", "Body wash / soap", "Deodorant", "Sunscreen (SPF 50)", "Moisturiser", "Face wash", "Razor"],
  "📱 Electronics": ["Phone charger", "Power bank (20000mAh)", "Universal adapter", "Earphones / AirPods", "Camera + memory card", "Laptop + charger", "Travel router"],
  "📋 Documents": ["Passport / Visa", "Flight tickets (printed)", "Hotel booking confirmation", "Travel insurance", "ID card copy", "Emergency contact list", "Vaccination certificate"],
  "💊 Health": ["Prescription medicines", "Paracetamol / pain relief", "Antidiarrheal tablets", "Motion sickness tablets", "Band-aids & antiseptic", "Insect repellent", "ORS sachets"],
  "🎒 Essentials": ["Backpack / suitcase", "Day bag / tote", "Money belt / pouch", "Padlock for hostel", "Travel pillow", "Eye mask & earplugs", "Reusable water bottle", "Snacks for journey"],
};

const STYLE_EXTRAS = {
  Adventure: ["Trekking boots", "Waterproof jacket", "Trekking poles", "Headlamp + batteries", "Compass", "Energy bars", "First-aid kit"],
  Backpacking: ["Quick-dry towel", "Hostel padlock", "Sleep sheet", "Rain cover for bag", "Budget money pouch"],
  Luxury: ["Formal attire (dinner)", "Luxury skincare set", "Smart watch", "Silk eye mask", "Premium luggage tags"],
  Family: ["Baby wipes", "Kids snacks", "Portable games", "Children's medicines", "Stroller (compact)", "Extra change of clothes"],
  Beach: ["Flip flops", "Sunglasses", "Beach towel", "Snorkelling mask", "Waterproof bag", "Aftersun lotion"],
};

export default function PackingList() {
  const [style, setStyle] = useState("");
  const [generated, setGenerated] = useState(false);
  const [checked, setChecked] = useState({});
  const [customItem, setCustomItem] = useState("");
  const [customItems, setCustomItems] = useState([]);
  const [openCats, setOpenCats] = useState(Object.keys(PRESET_CATEGORIES).reduce((a, k) => ({ ...a, [k]: true }), {}));

  const allItems = {
    ...PRESET_CATEGORIES,
    ...(style && STYLE_EXTRAS[style] ? { [`✨ ${style} Extras`]: STYLE_EXTRAS[style] } : {}),
    ...(customItems.length > 0 ? { "📌 My Custom Items": customItems } : {}),
  };

  const totalItems = Object.values(allItems).flat().length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const toggleItem = (cat, item) => {
    const key = `${cat}::${item}`;
    setChecked((p) => ({ ...p, [key]: !p[key] }));
  };

  const isChecked = (cat, item) => !!checked[`${cat}::${item}`];

  const addCustom = () => {
    if (!customItem.trim()) return;
    setCustomItems([...customItems, customItem.trim()]);
    setCustomItem("");
  };

  const removeCustom = (item) => setCustomItems(customItems.filter((i) => i !== item));

  const toggleCat = (cat) => setOpenCats((p) => ({ ...p, [cat]: !p[cat] }));

  const uncheckAll = () => setChecked({});

  return (
    <div className="pl-page">
      <div className="bg-blob blob-primary" />
      <div className="bg-blob blob-secondary" />

      <div className="pl-container">
        <div className="pl-header fade-up">
          <span className="badge badge-emerald">🧳 Smart Packer</span>
          <h1>Packing List</h1>
          <p>Never forget anything again. Generate a smart packing list tailored to your travel style.</p>
        </div>

        {/* Style selector + generate */}
        <div className="pl-setup glass-panel fade-up fade-up-1">
          <div className="pl-style-section">
            <p className="cc-section-label">Select Your Travel Style</p>
            <div className="pl-styles">
              {Object.keys(STYLE_EXTRAS).map((s) => (
                <button
                  key={s}
                  className={`pl-style-btn ${style === s ? "selected" : ""}`}
                  onClick={() => setStyle(s)}
                >
                  {s === "Adventure" ? "🏔️" : s === "Backpacking" ? "🎒" : s === "Luxury" ? "💎" : s === "Family" ? "👨‍👩‍👧" : "🏖️"} {s}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => { setGenerated(true); setChecked({}); }}>
            {generated ? "🔄 Reset & Regenerate" : "✨ Generate Packing List"}
          </button>
        </div>

        {generated && (
          <>
            {/* Progress bar */}
            <div className="pl-progress-wrap glass-panel fade-up">
              <div className="pl-progress-header">
                <span>📦 Packing Progress</span>
                <span className="pl-progress-count">{checkedCount} / {totalItems} items packed</span>
                <button className="pl-reset-btn" onClick={uncheckAll}>Reset</button>
              </div>
              <div className="pl-progress-bar-bg">
                <div
                  className="pl-progress-bar-fill"
                  style={{ width: `${progress}%`, background: progress === 100 ? "var(--secondary)" : "linear-gradient(90deg, var(--primary), var(--accent-purple))" }}
                />
              </div>
              <div className="pl-progress-pct">{progress}% ready to travel {progress === 100 ? "🎉" : ""}</div>
            </div>

            {/* Categories */}
            <div className="pl-categories fade-up fade-up-2">
              {Object.entries(allItems).map(([cat, items]) => (
                <div key={cat} className="pl-category glass-panel">
                  <button className="pl-cat-header" onClick={() => toggleCat(cat)}>
                    <span className="pl-cat-title">{cat}</span>
                    <span className="pl-cat-count">{items.filter((i) => isChecked(cat, i)).length}/{items.length}</span>
                    <span className="pl-cat-chevron">{openCats[cat] ? "▲" : "▼"}</span>
                  </button>
                  {openCats[cat] && (
                    <div className="pl-items">
                      {items.map((item) => (
                        <div
                          key={item}
                          className={`pl-item ${isChecked(cat, item) ? "packed" : ""}`}
                          onClick={() => toggleItem(cat, item)}
                        >
                          <span className="pl-checkbox">{isChecked(cat, item) ? "✓" : ""}</span>
                          <span className="pl-item-label">{item}</span>
                          {cat === "📌 My Custom Items" && (
                            <button className="pl-remove-item" onClick={(e) => { e.stopPropagation(); removeCustom(item); }}>✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add custom item */}
            <div className="pl-custom glass-panel fade-up fade-up-3">
              <h4>➕ Add Custom Item</h4>
              <div className="pl-custom-row">
                <input
                  className="form-input"
                  placeholder="e.g. GoPro, travel guitar..."
                  value={customItem}
                  onChange={(e) => setCustomItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustom()}
                />
                <button className="btn btn-primary" onClick={addCustom}>Add</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
