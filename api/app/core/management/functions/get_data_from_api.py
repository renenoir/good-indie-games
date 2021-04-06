import requests
import os


def get_data_from_api(order, limit, offset):
    """Get data from igdb API"""
    token_url = 'https://id.twitch.tv/oauth2/token'
    token_params = {
        'client_id': os.environ.get('CLIENT_ID'),
        'client_secret': os.environ.get('CLIENT_SECRET'),
        'grant_type': 'client_credentials'
    }
    token_req = requests.post(token_url, params=token_params)
    token = token_req.json().get('access_token')

    url = 'https://api.igdb.com/v4/games'

    headers = {
        'Client-ID': os.environ.get('CLIENT_ID'),
        'Authorization': 'Bearer ' + str(token)
    }

    data = 'fields name, summary, websites.url, similar_games.name, \
            platforms.name, involved_companies.company.name, \
            involved_companies.developer, cover.url,  \
            genres.name, themes.name, total_rating, first_release_date; \
            where total_rating > 65 & total_rating_count >= 8 & \
            genres = (32); sort created_at ' + f"{order}" + '; \
            offset ' + f"{offset}" + '; limit ' + f"{limit}" + ';'

    req = requests.post(url, headers=headers, data=data)
    print('Status code:', req.status_code)

    response_dict = req.json()

    if req.status_code != 200:
        return False

    return response_dict
