
# core/api/views.py


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from core.services.salary_service import get_salary_range
from core.services.affordability_service import calculate_affordability
from core.models import Location

@api_view(['POST'])
def salary_lookup(request):
    """
    Get salary ranges based on occupation, education, and experience
    """
    result = get_salary_range(request.data)
    
    if not result["success"]:
        return Response(result, status=status.HTTP_404_NOT_FOUND)
    
    return Response(result)


@api_view(['POST'])
def affordability_view(request):
    """
    Calculate affordability based on salary and location
    """
    # First, get the salary data
    salary_result = get_salary_range(request.data)
    
    if not salary_result["success"]:
        return Response(salary_result, status=status.HTTP_404_NOT_FOUND)
    
    # Get location from request
    location = request.data.get("location")
    
    if not location:
        return Response({
            "success": False,
            "message": "Location is required"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate location exists
    if not Location.objects.filter(name__iexact=location.strip()).exists():
        return Response({
            "success": False,
            "message": f"Location '{location}' not found in our database"
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Get the first salary match (if multiple, let user know)
    salary_data = salary_result["data"][0]
    
    # Calculate affordability
    result = calculate_affordability(salary_data, location)
    
    # Add additional info if multiple salary matches found
    if len(salary_result["data"]) > 1:
        result["note"] = "Multiple salary matches found. Showing first match. Consider providing more specific criteria."
    
    return Response(result)


@api_view(['GET'])
def list_locations(request):
    """
    Get all available locations
    """
    locations = Location.objects.all().values('id', 'name')
    return Response({
        "success": True,
        "data": list(locations)
    })