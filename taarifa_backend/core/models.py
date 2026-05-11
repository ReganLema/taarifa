
# models.py
# This module defines the database models for occupations, education levels, experience levels, locations, salaries, and cost of living data.


from django.db import models


class Occupation(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class EducationLevel(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class ExperienceLevel(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Salary(models.Model):
    occupation = models.ForeignKey(Occupation, on_delete=models.CASCADE)
    education_level = models.ForeignKey(EducationLevel, on_delete=models.CASCADE)
    experience_level = models.ForeignKey(ExperienceLevel, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True, blank=True)

    min_salary = models.DecimalField(max_digits=10, decimal_places=2)
    max_salary = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.occupation} - {self.experience_level}"


class CostOfLiving(models.Model):
    location = models.OneToOneField(Location, on_delete=models.CASCADE)

    rent_percent = models.FloatField()
    food_percent = models.FloatField()
    transport_percent = models.FloatField()
    utility_percent = models.FloatField()

    def __str__(self):
        return f"Cost - {self.location.name}"