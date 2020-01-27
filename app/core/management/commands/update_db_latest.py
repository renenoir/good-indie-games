from core.management.functions.update_database import update_database
from core.management.functions.get_data_from_api import get_data_from_api
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """Django command for adding latest games from igdb API"""

    def handle(self, *args, **options):
        response_dict = get_data_from_api('desc', 100, 0)
        update_database(response_dict=response_dict)
        self.stdout.write("Database is updated.")
