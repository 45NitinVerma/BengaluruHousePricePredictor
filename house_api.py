from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and data
model = pickle.load(open("RidgeModel.pkl", "rb"))
data = pd.read_csv("Cleaned_data.csv")

# Extract unique locations
locations = sorted(data["location"].unique())

@app.route("/locations", methods=["GET"])
def get_locations():
    return jsonify({"locations": locations})

@app.route("/predict", methods=["POST"])
def predict_price():
    try:
        data_json = request.get_json()

        location = str(data_json['location'])
        sqft = float(data_json['total_sqft'])
        bath = int(data_json['bath'])
        bhk = int(data_json['bhk'])

        # Create DataFrame for model input
        input_df = pd.DataFrame([{
            "location": location,
            "total_sqft": sqft,
            "bath": bath,
            "bhk": bhk
        }])

        # Model prediction
        prediction = model.predict(input_df)[0]
        return jsonify({"estimated_price": round(prediction, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
