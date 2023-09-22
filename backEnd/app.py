from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

load_dotenv()
import os
app = Flask(__name__)
CORS(app)

mongodb_url = os.getenv("DATABASE_URL")
# Connect to MongoDB
client = MongoClient(mongodb_url)
db = client["mydatabase"]
collection = db["mycollection"]

@app.route('/data', methods=['POST'])
def insert_data():
    try:
       
        # Get data from the request
        data = request.json
        filename = data.get('filename')

        # for root, dirs, files in os.walk('/'):
        #   if filename in files:
        #      file_path = os.path.join(root, filename)
        #      break

        # pathOfFile = file_path
        data["path"] = '/'+filename


        # Make a copy of the data object
        data_copy = data.copy()

        # Convert the '_id' field to a string if it exists
        if '_id' in data_copy:
            data_copy['_id'] = str(data_copy['_id'])

        # Insert data_copy into the collection
        result = collection.insert_one(data_copy)

        # Close the MongoDB connection
        # client.close()


        # data["path"] = pathOfFile


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

# Get Route
@app.route('/search', methods=['POST'])
def serach_data():
    try:
        data = request.json
        fielname = data.get('filename')


        fileData = collection.find_one({'filename':fielname})

        if fileData:
            fileData.pop('_id',None)
            return jsonify(fileData), 200
        else:
            return jsonify({'error':'file not found...'}), 200
        

    except Exception as e:
        response = {'error':str(e)}
        return jsonify(response), 500

if __name__ == "__main__":
    app.run(debug=False,host='0.0.0.0')