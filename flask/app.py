from asyncio import sleep
from flask import Flask, request, redirect
import requests
from dotenv import load_dotenv
from os import environ
import logging
from flask import Flask, request, jsonify
from flask_caching import Cache

app = Flask(__name__)

app.config['CACHE_TYPE'] = 'filesystem'
app.config['CACHE_DIR'] = 'cache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 3600 # reset cache every hour

cache = Cache(app)

def custom_cache_key(*args, **kwargs):
	bearer_token = request.headers.get('Authorization')
	url = request.url
	cache_key = (url, bearer_token)
	return cache_key

logging.basicConfig(level=logging.DEBUG)

# Replace these with your actual Client ID and Client Secret from the 42 API
load_dotenv()
CLIENT_ID = environ.get("CLIENT_ID")
CLIENT_SECRET = environ.get("CLIENT_SECRET")
REDIRECT_URI = environ.get("REDIRECT_URI")

@app.route('/api/auth/callback')
def auth_callback():
    data={
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': request.args.get('code'),
            'redirect_uri': REDIRECT_URI,
        }
    token_response = requests.post('https://api.intra.42.fr/oauth/token', data=data)


    if token_response.status_code != 200:
        logging.error(token_response.json())
        return token_response.json(), token_response.status_code
    headers = {
        'Authorization': f"Bearer {token_response.json()['access_token']}"
    }
    # me_response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
    return token_response.json(), token_response.status_code


@app.route('/api/me')
@cache.cached(key_prefix=custom_cache_key)
def me():
    token = request.headers.get('Authorization')
    if not token:
        return 'No token provided', 401
    logging.debug(token)
    response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': token})
    logging.debug(response.json())
    # with open('response.json', 'w') as f:
    #     f.write(response.text)
    return response.json(), response.status_code

@app.route('/api/events')
@cache.cached(key_prefix=custom_cache_key)
def events():
    token = request.headers.get('Authorization')
    if not token:
        return 'No token provided', 401

    user_id = request.args.get('user_id')
    if not user_id:
        return 'No user ID provided', 400

    all_events = []
    page = 1
    retries = 10
    while True:
        response = requests.get(
            f'https://api.intra.42.fr/v2/users/{user_id}/events',
            params={'page': page},  # Assuming 'per_page' is supported
            headers={'Authorization': token}
        )
        while response.status_code == 429:
            retries -= 1
            sleep(.5)
            response = requests.get(
                f'https://api.intra.42.fr/v2/users/{user_id}/events',
                params={'page': page},  # Assuming 'per_page' is supported
                headers={'Authorization': token}
            )
            if retries == 0:
                return 'Too many retries', 429
        if response.status_code != 200:
            return response.json(), response.status_code

        events = response.json()
        if not events:
            break

        all_events.extend(events)
        page += 1
    all_events = [event for event in all_events if event['kind'] != 'extern' and event['kind'] != 'association']

    return jsonify(all_events), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
