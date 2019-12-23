from core.management.functions.update_database import update_database
from core.management.functions.get_data_from_api import get_data_from_api
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """Django command for updating the database from igdb API"""

    def handle(self, *args, **options):
        games = 0
        while True:
            response_dict = get_data_from_api(100, games)
            if not response_dict:
                self.stdout.write("Database is updated.")
                break
            update_database(response_dict=response_dict)
            games += 100
