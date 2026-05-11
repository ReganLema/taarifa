import graphene
from graphene_django import DjangoObjectType
from .models import (
    Occupation, 
    EducationLevel, 
    ExperienceLevel, 
    Location,
    Salary,
    CostOfLiving
)
from django.db.models import Q

# ============================================
# Object Types (Convert Django Models to GraphQL Types)
# ============================================

class OccupationType(DjangoObjectType):
    class Meta:
        model = Occupation
        fields = ('id', 'name')

class EducationLevelType(DjangoObjectType):
    class Meta:
        model = EducationLevel
        fields = ('id', 'name')

class ExperienceLevelType(DjangoObjectType):
    class Meta:
        model = ExperienceLevel
        fields = ('id', 'name')

class LocationType(DjangoObjectType):
    class Meta:
        model = Location
        fields = ('id', 'name')

class SalaryType(DjangoObjectType):
    class Meta:
        model = Salary
        fields = (
            'id', 'occupation', 'education_level', 
            'experience_level', 'location',
            'min_salary', 'max_salary', 'created_at'
        )

class CostOfLivingType(DjangoObjectType):
    class Meta:
        model = CostOfLiving
        fields = (
            'id', 'location', 'rent_percent', 
            'food_percent', 'transport_percent', 'utility_percent'
        )

# ============================================
# Custom Types for Salary Range Response
# ============================================

class SalaryDataType(graphene.ObjectType):
    occupation = graphene.String()
    education = graphene.String()
    experience = graphene.String()
    min_salary = graphene.Float()
    max_salary = graphene.Float()

class SalaryRangeResponseType(graphene.ObjectType):
    success = graphene.Boolean()
    message = graphene.String()
    data = graphene.List(SalaryDataType)

# ============================================
# Custom Types for Affordability Response
# ============================================

class ExpenseBreakdownType(graphene.ObjectType):
    amount = graphene.Float()
    percent = graphene.Float()

class ExpensesType(graphene.ObjectType):
    rent = graphene.Field(ExpenseBreakdownType)
    food = graphene.Field(ExpenseBreakdownType)
    transport = graphene.Field(ExpenseBreakdownType)
    utility = graphene.Field(ExpenseBreakdownType)
    total = graphene.Field(ExpenseBreakdownType)

class SalaryRangeType(graphene.ObjectType):
    min = graphene.Float()
    max = graphene.Float()
    average = graphene.Float()

class SavingsType(graphene.ObjectType):
    amount = graphene.Float()
    percent = graphene.Float()
    disposable_income = graphene.Float()
    emergency_fund = graphene.Float()

class AffordabilityResponseType(graphene.ObjectType):
    success = graphene.Boolean()
    message = graphene.String()
    location = graphene.String()
    salary = graphene.Field(SalaryRangeType)
    expenses = graphene.Field(ExpensesType)
    savings = graphene.Field(SavingsType)
    affordability_rating = graphene.String()
    summary = graphene.String()

# ============================================
# Queries (Read operations)
# ============================================

class Query(graphene.ObjectType):
    # List queries
    occupations = graphene.List(OccupationType)
    education_levels = graphene.List(EducationLevelType)
    experience_levels = graphene.List(ExperienceLevelType)
    locations = graphene.List(LocationType)
    salaries = graphene.List(SalaryType)
    cost_of_living = graphene.List(CostOfLivingType)
    
    # Search occupations query (autocomplete)
    search_occupations = graphene.List(
        OccupationType,
        search_term=graphene.String(required=True),
        limit=graphene.Int(default_value=10),
    )
    
    # Salary Range Query
    salary_range = graphene.Field(
        SalaryRangeResponseType,
        occupation=graphene.String(required=True),
        education=graphene.String(required=True),
        experience=graphene.String(required=True),
    )
    
    # Affordability Calculation
    calculate_affordability = graphene.Field(
        AffordabilityResponseType,
        occupation=graphene.String(required=True),
        education=graphene.String(required=True),
        experience=graphene.String(required=True),
        location=graphene.String(required=True),
    )

    # ============================================
    # Resolvers
    # ============================================

    def resolve_occupations(self, info):
        """Get all occupations"""
        return Occupation.objects.all().order_by('name')

    def resolve_education_levels(self, info):
        """Get all education levels"""
        return EducationLevel.objects.all()

    def resolve_experience_levels(self, info):
        """Get all experience levels"""
        return ExperienceLevel.objects.all()

    def resolve_locations(self, info):
        """Get all locations"""
        return Location.objects.all().order_by('name')

    def resolve_salaries(self, info):
        """Get all salaries"""
        return Salary.objects.all().select_related(
            'occupation', 'education_level', 'experience_level', 'location'
        )

    def resolve_cost_of_living(self, info):
        """Get all cost of living data"""
        return CostOfLiving.objects.all().select_related('location')

    def resolve_search_occupations(self, info, search_term, limit=10):
        """Search occupations by name for autocomplete"""
        if not search_term:
            return Occupation.objects.none()
        
        return Occupation.objects.filter(
            name__icontains=search_term
        ).order_by('name')[:limit]

    def resolve_salary_range(self, info, occupation, education, experience):
        """Get salary range based on occupation, education, and experience"""
        try:
            # Try to find exact match
            salaries = Salary.objects.filter(
                occupation__name__iexact=occupation.strip(),
                education_level__name__iexact=education.strip(),
                experience_level__name__iexact=experience.strip(),
            ).select_related('occupation', 'education_level', 'experience_level')

            if salaries.exists():
                data = []
                for salary in salaries:
                    data.append(SalaryDataType(
                        occupation=salary.occupation.name,
                        education=salary.education_level.name,
                        experience=salary.experience_level.name,
                        min_salary=float(salary.min_salary),
                        max_salary=float(salary.max_salary),
                    ))
                return SalaryRangeResponseType(success=True, data=data)
            else:
                return SalaryRangeResponseType(
                    success=False,
                    message=f"No salary data found for {occupation} with {education} and {experience}"
                )
        except Exception as e:
            return SalaryRangeResponseType(
                success=False,
                message=str(e)
            )

    def resolve_calculate_affordability(self, info, occupation, education, experience, location):
        """Calculate affordability based on salary and location"""
        try:
            # First get salary data
            salaries = Salary.objects.filter(
                occupation__name__iexact=occupation.strip(),
                education_level__name__iexact=education.strip(),
                experience_level__name__iexact=experience.strip(),
            ).select_related('occupation', 'education_level', 'experience_level')

            if not salaries.exists():
                return AffordabilityResponseType(
                    success=False,
                    message=f"No salary data found for {occupation}"
                )

            # Get first salary match
            salary = salaries.first()
            min_salary = float(salary.min_salary)
            max_salary = float(salary.max_salary)
            avg_salary = (min_salary + max_salary) / 2

            # Get cost of living data for location
            try:
                cost = CostOfLiving.objects.select_related('location').get(
                    location__name__iexact=location.strip()
                )
            except CostOfLiving.DoesNotExist:
                return AffordabilityResponseType(
                    success=False,
                    message=f"No cost of living data found for {location}"
                )

            # Calculate expenses
            rent = avg_salary * (float(cost.rent_percent) / 100)
            food = avg_salary * (float(cost.food_percent) / 100)
            transport = avg_salary * (float(cost.transport_percent) / 100)
            utility = avg_salary * (float(cost.utility_percent) / 100)
            
            total_expense = rent + food + transport + utility
            total_percent = float(
                cost.rent_percent + cost.food_percent + 
                cost.transport_percent + cost.utility_percent
            )
            
            savings_amount = avg_salary - total_expense
            savings_percent = round((savings_amount / avg_salary) * 100, 2) if avg_salary > 0 else 0

            # Determine affordability rating
            if savings_percent >= 30:
                rating = "Excellent"
            elif savings_percent >= 20:
                rating = "Good"
            elif savings_percent >= 10:
                rating = "Moderate"
            elif savings_percent >= 0:
                rating = "Tight"
            else:
                rating = "Critical"

            return AffordabilityResponseType(
                success=True,
                location=cost.location.name,
                salary=SalaryRangeType(
                    min=min_salary,
                    max=max_salary,
                    average=avg_salary,
                ),
                expenses=ExpensesType(
                    rent=ExpenseBreakdownType(
                        amount=round(rent, 2), 
                        percent=float(cost.rent_percent)
                    ),
                    food=ExpenseBreakdownType(
                        amount=round(food, 2), 
                        percent=float(cost.food_percent)
                    ),
                    transport=ExpenseBreakdownType(
                        amount=round(transport, 2), 
                        percent=float(cost.transport_percent)
                    ),
                    utility=ExpenseBreakdownType(
                        amount=round(utility, 2), 
                        percent=float(cost.utility_percent)
                    ),
                    total=ExpenseBreakdownType(
                        amount=round(total_expense, 2), 
                        percent=round(total_percent, 2)
                    ),
                ),
                savings=SavingsType(
                    amount=round(savings_amount, 2),
                    percent=savings_percent,
                    disposable_income=round(savings_amount * 0.7, 2),
                    emergency_fund=round(savings_amount * 0.3, 2),
                ),
                affordability_rating=rating,
                summary=(
                    f"In {cost.location.name}, you can save {savings_percent}% "
                    f"of your salary. This is considered '{rating}' affordability."
                ),
            )
        except Exception as e:
            return AffordabilityResponseType(
                success=False,
                message=str(e)
            )


# ============================================
# Schema
# ============================================

schema = graphene.Schema(query=Query)