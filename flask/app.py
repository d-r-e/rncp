from flask import Flask, request, redirect
import requests
from dotenv import load_dotenv
from os import environ
app = Flask(__name__)
import logging

logging.basicConfig(level=logging.DEBUG)

# Replace these with your actual Client ID and Client Secret from the 42 API
load_dotenv()
CLIENT_ID = environ.get("CLIENT_ID")
CLIENT_SECRET = environ.get("CLIENT_SECRET")
REDIRECT_URI = "'http://localhost/auth/callback'"

@app.route('/api/auth/callback')
def auth_callback():
    data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'client_credentials',
            'code': request.args.get('code'),
            'redirect_uri': REDIRECT_URI,

        }
    logging.debug(data)
    token_response = requests.post('https://api.intra.42.fr/oauth/token', data=data)


    if token_response.status_code != 200:
        logging.error(token_response.json())
        return token_response.json(), token_response.status_code

    token = token_response.json().get('access_token')
    return {'token': token}

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
