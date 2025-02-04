from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import os
import joblib
from openai import OpenAI
import numpy as np
from flask_cors import CORS
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = joblib.load("../ML_model/logistic_regression_model.pkl")
sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
load_dotenv()
secret_key = os.getenv('OPEN_AI_API_KEY')
client = OpenAI(api_key=secret_key)

CORS(app, origins=["http://localhost:3000"])


@app.route('/health', methods=['GET'])
def greet():
    return "Server Healthy"

@app.route("/predict", methods=["POST"])
def predict():
    try:

        data = request.json
        sentence = data.get("name")
        
        if not sentence:
            return jsonify({"error": "No sentence provided"}), 400
        

        sentence_embedding = sentence_model.encode([sentence])


        prediction = model.predict(sentence_embedding)[0] 


        completion = client.chat.completions.create(
        model="ft:gpt-3.5-turbo-0125:personal:mental-health-data:Ag8EKMsD",
        messages=[
        {
            "role": "system",
            "content": (
                "You are a mental health therapist's assistant."
                "The prompts you receive will describe what a patient is going through,"
                "and your task is to provide empathetic, actionable suggestions and insights to help the therapist in assisting the patient. The insights should be very effective "
                "Always prioritize sensitivity, understanding, and mental well-being."

                "Below is a sample response. Use this tone and structure while responding"
                "If everyone thinks you're worthless, then maybe you need to find new people to hang out with.Seriously, the social context in which a person lives is a big influence in self-esteem.Otherwise, you can go round and round trying to understand why you're not worthless, then go back to the same crowd and be knocked down again.There are many inspirational messages you can find in social media. Maybe read some of the ones which state that no person is worthless, and that everyone has a good purpose to their life.Also, since our culture is so saturated with the belief that if someone doesn't feel good about themselves that this is somehow terrible.Bad feelings are part of living. They are the motivation to remove ourselves from situations and relationships which do us more harm than good.Bad feelings do feel terrible. Your feeling of worthlessness may be good in the sense of motivating you to find out that you are much better than your feelings today."
                "Below is the prompt that the patient has told the therapist and you need to assist the therapist"
                f"{sentence}"
            )
        },
        {
            "role": "user",
            "content": (
                f"{prediction} is the category of the problem that the patient is facing and \"{sentence}\" is what the patient told to the therapist, provide soothing help and show that you care. Your reponses should always be conversational and your offering of help should not be generic"
            )
        }
        ]
    )
        response_message = completion.choices[0].message.content
        return jsonify({"message": prediction, "advice": response_message})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)