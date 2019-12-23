from core.models import Genre, Theme, Platform, Developer, Publisher, Game

import datetime


def update_database(response_dict):
    """Function for creating game objects and updating the database"""

    # All genres, themes, platforms, developers and publishers names in the db
    gen_names = list(map(lambda gen: gen.name, Genre.objects.all()))
    theme_names = list(map(lambda them: them.name, Theme.objects.all()))
    plat_names = list(map(lambda plat: plat.name, Platform.objects.all()))
    dev_names = list(map(lambda dev: dev.name, Developer.objects.all()))
    pub_names = list(map(lambda pub: pub.name, Publisher.objects.all()))
    # All igdb_ids in the database
    ids = list(map(lambda game: game.igdb_id, Game.objects.all()))

    # Getting attributes for creating game
    for game_item in response_dict:
        igdb_id = game_item.get('id')
        if igdb_id in ids:
            continue
        name = game_item.get('name')
        summary = game_item.get('summary') or ''
        rating = int(game_item.get('total_rating'))
        first_release_date = game_item.get('first_release_date') if (
            isinstance(game_item.get('first_release_date'), int)
        ) else False

        cover_item = game_item.get('cover')
        cover = cover_item.get('url') if (
            isinstance(cover_item, dict)
            and isinstance(cover_item.get('url'), str)
        ) else ""

        websites_list = game_item.get('websites')
        websites = list(
            map(lambda website: website.get('url'), websites_list)
        ) if isinstance(websites_list, list) else []

        similar_games_list = game_item.get('similar_games')
        similar_games = list(map(
            lambda similar_game: similar_game.get('id'),
            similar_games_list
        )) if isinstance(similar_games_list, list) else []

        genres_list = game_item.get('genres')
        genres = list(
            map(lambda genre: genre.get('name'), genres_list)
        ) if isinstance(genres_list, list) else []

        themes_list = game_item.get('themes')
        themes = list(
            map(lambda theme: theme.get('name'), themes_list)
        ) if isinstance(themes_list, list) else []

        platforms_list = game_item.get('platforms')
        platforms = list(
            map(lambda platform: platform.get('name'), platforms_list)
        ) if isinstance(platforms_list, list) else []

        developers = []
        publishers = []
        involved_companies = game_item.get('involved_companies')
        if isinstance(involved_companies, list):
            for company_item in involved_companies:
                company = company_item.get('company') if (
                    isinstance(company_item, dict)
                ) else False
                if not company:
                    continue
                if company_item.get('developer'):
                    developers.append(company.get("name"))
                else:
                    publishers.append(company.get("name"))

        # Create game object in db
        game = Game.objects.create(
            igdb_id=igdb_id,
            name=name,
            summary=summary,
            rating=rating,
            first_release_date=datetime.datetime.fromtimestamp(
                first_release_date
            ),
            websites=websites,
            similar_games=similar_games,
            cover=cover
        )

        # Create genres, platforms, developers and publishers in db
        for gen in genres:
            if gen not in gen_names:
                game.genres.add(Genre.objects.create(name=gen))
                gen_names.append(gen)
            else:
                game.genres.add(Genre.objects.get(name=gen))
        for theme in themes:
            if theme not in theme_names:
                game.themes.add(Theme.objects.create(name=theme))
                them_names.append(theme)
            else:
                game.themes.add(Theme.objects.get(name=theme))
        for platf in platforms:
            if platf not in plat_names:
                game.platforms.add(Platform.objects.create(name=platf))
                plat_names.append(platf)
            else:
                game.platforms.add(Platform.objects.get(name=platf))
        for dev in developers:
            if dev not in dev_names:
                game.developers.add(Developer.objects.create(name=dev))
                dev_names.append(dev)
            else:
                game.developers.add(Developer.objects.get(name=dev))
        for pub in publishers:
            if pub not in pub_names:
                game.publishers.add(Publisher.objects.create(name=pub))
                pub_names.append(pub)
            else:
                game.publishers.add(Publisher.objects.get(name=pub))
