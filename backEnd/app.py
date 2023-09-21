# client = MongoClient("mongodb+srv://pavankumarkings007:9701004594Pa%40@fashionhub.m6v74y6.mongodb.net/")
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app)

mongodb_url = "mongodb+srv://pavankumarkings007:9701004594Pa%40@fashionhub.m6v74y6.mongodb.net/"

@app.route('/data', methods=['POST'])
def insert_data():
    try:
        # Connect to MongoDB
        client = MongoClient(mongodb_url)
        db = client["mydatabase"]
        collection = db["mycollection"]

        # Get data from the request
        data = request.get_json()

        # Make a copy of the data object
        data_copy = data.copy()

        # Convert the '_id' field to a string if it exists
        if '_id' in data_copy:
            data_copy['_id'] = str(data_copy['_id'])

        # Insert data_copy into the collection
        result = collection.insert_one(data_copy)

        # Close the MongoDB connection
        client.close()

        # Include the 'data' object in the response
        response = {
            "message": "Data created",
            "metaData": data  # Include the 'data' object here
        }

        return jsonify(response), 200

    except Exception as e:
        # Handle any errors
        response = {"error": str(e)}
        return jsonify(response), 500

if __name__ == "__main__":
    app.run("localhost", port=8800)