
# taarifa_backend/urls.py

from django.http import JsonResponse
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

def health(request):
    return JsonResponse({"status": "healthy"})

urlpatterns = [
    path("health/", health),
    path("admin/", admin.site.urls),
    path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),
]