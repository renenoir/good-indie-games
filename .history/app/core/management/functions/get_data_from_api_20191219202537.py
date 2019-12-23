import requests


def get_data_from_api(limit, offset):
    """Get data from igdb API"""
    url = 'https://api-v3.igdb.com/games/'

    headers = {'user-key': 'f58d91c59942416ed14564e116f79a41'}

    data = 'fields name, summary, websites.url, similar_games.name, \
            platforms.name, involved_companies.company.name, \
            involved_companies.developer, cover.url, \
            genres.name, total_rating, first_release_date; \
            where rating > 65 & genres = (32); \
            sort total_rating_count desc; \
            offset ' + f"{offset}" + '; limit ' + f"{limit}" + ';'

    req = requests.post(url, headers=headers, data=data)
    print('Status code:', req.status_code)

    response_dict = req.json()

    if req.status_code != 200:
        return False

    return response_dict
