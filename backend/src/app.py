from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_placement

app = Flask(__name__)

# Enable CORS for React frontend
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "message": "Placement Prediction API Running"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        result = predict_placement(data)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(debug=True)