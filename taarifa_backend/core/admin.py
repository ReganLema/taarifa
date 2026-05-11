from django.contrib import admin
from .models import Occupation, EducationLevel, ExperienceLevel, Salary
from .models import CostOfLiving, Location


@admin.register(Occupation)
class OccupationAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(EducationLevel)
class EducationLevelAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(ExperienceLevel)
class ExperienceLevelAdmin(admin.ModelAdmin):
    search_fields = ('name',)



@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name',)



@admin.register(CostOfLiving)
class CostOfLivingAdmin(admin.ModelAdmin):
    list_display = (
        'location',
        'rent_display',
        'food_display',
        'transport_display',
        'utility_display',
    )

    def rent_display(self, obj):
        return f"{obj.rent_percent}%"

    def food_display(self, obj):
        return f"{obj.food_percent}%"

    def transport_display(self, obj):
        return f"{obj.transport_percent}%"

    def utility_display(self, obj):
        return f"{obj.utility_percent}%"


@admin.register(Salary)
class SalaryAdmin(admin.ModelAdmin):
    list_display = (
        'occupation',
        'education_level',
        'experience_level',
        'min_salary',
        'max_salary',
        'location',
    )
    list_filter = (
        'occupation',
        'education_level',
        'experience_level',
        'location',

    )
    search_fields = ('occupation__name', 'location__name')