from rest_framework import serializers

class SalaryLookupSerializer(serializers.Serializer):
    occupation = serializers.CharField(max_length=255)
    education = serializers.CharField(max_length=100)
    experience = serializers.CharField(max_length=100)

class AffordabilitySerializer(serializers.Serializer):
    occupation = serializers.CharField(max_length=255)
    education = serializers.CharField(max_length=100)
    experience = serializers.CharField(max_length=100)
    location = serializers.CharField(max_length=100)