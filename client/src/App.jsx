import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'

function App() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    location: "",
    bhk: "",
    bath: "",
    total_sqft: ""
  });
  const [price, setPrice] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/locations")
      .then(res => setLocations(res.data.locations))
      .catch(err => console.error("Error loading locations", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = () => {
    axios.post("http://localhost:5000/predict", form)
      .then(res => setPrice(res.data.estimated_price))
      .catch(err => {
        console.error(err);
        setPrice("Prediction failed");
      });
  };

  const isFormValid = form.location && form.total_sqft && form.bhk && form.bath;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "30px" }}>
      <h2>Bengaluru House Price Predictor 🏠</h2>

      <label>Location:</label><br />
      <select name="location" onChange={handleChange} value={form.location}>
        <option value="">Select Location</option>
        {locations.map(loc => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select><br /><br />

      <label>Total Sqft:</label><br />
      <input
        type="number"
        name="total_sqft"
        value={form.total_sqft}
        onChange={handleChange}
        placeholder="Enter total square feet"
      /><br /><br />

      <label>BHK:</label><br />
      <input
        type="number"
        name="bhk"
        value={form.bhk}
        onChange={handleChange}
        placeholder="Enter number of BHKs"
      /><br /><br />

      <label>Bathrooms:</label><br />
      <input
        type="number"
        name="bath"
        value={form.bath}
        onChange={handleChange}
        placeholder="Enter number of bathrooms"
      /><br /><br />

      <button onClick={handlePredict} disabled={!isFormValid}>Predict Price</button>

      {price && (
        <h3>Estimated Price: ₹ {price} Lakhs</h3>
      )}
    </div>
  );
}

export default App;
