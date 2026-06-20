from django.core.management.base import BaseCommand
from core.models import Location, CostOfLiving

class Command(BaseCommand):
    help = "Imports cost of living data for various locations in Tanzania into the database."

    def handle(self, *args, **options):
        self.stdout.write("⏳ Importing cost of living data...")

        cost_of_living_data = [
    ["Dar es Salaam", 35, 22, 12, 8],
    ["Dodoma", 22, 19, 9, 6],
    ["Arusha", 28, 21, 10, 7],
    ["Mwanza", 25, 20, 10, 7],
    ["Mbeya", 22, 18, 9, 6],
    ["Morogoro", 20, 18, 9, 6],
    ["Tanga", 23, 19, 10, 6],
    ["Tabora", 19, 17, 9, 6],
    ["Kigoma", 18, 17, 10, 6],
    ["Iringa", 20, 18, 9, 6],
    ["Songea", 17, 16, 9, 5],
    ["Shinyanga", 19, 17, 9, 6],
    ["Moshi", 24, 19, 9, 6],
    ["Musoma", 20, 18, 10, 6],
    ["Bukoba", 21, 18, 10, 6],
    ["Sumbawanga", 17, 16, 10, 5],
    ["Singida", 18, 17, 9, 5],
    ["Mtwara", 20, 18, 10, 6],
    ["Lindi", 19, 17, 10, 6],
    ["Geita", 21, 18, 10, 6],
    ["Kahama", 19, 17, 9, 6],
    ["Zanzibar", 30, 23, 12, 8],
]

        count = 0
        for row in cost_of_living_data:
            location_name, rent, food, transport, utility = row

            location, _ = Location.objects.get_or_create(name=location_name)

            CostOfLiving.objects.update_or_create(
                location=location,
                defaults={
                    "rent_percent": rent,
                    "food_percent": food,
                    "transport_percent": transport,
                    "utility_percent": utility,
                }
            )
            count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ Successfully updated/created {count} cost of living locations!"))