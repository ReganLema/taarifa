
# core/api/urls.py

from django.urls import path
from .views import affordability_view, salary_lookup, list_locations

urlpatterns = [
    path('salary/', salary_lookup, name='salary-lookup'),
    path('affordability/', affordability_view, name='affordability'),
    path('locations/', list_locations, name='list-locations'),
]