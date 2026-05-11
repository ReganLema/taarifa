
# salary_selector.py

from core.models import Salary

def get_salary_by_filters(occupation, education, experience):
    return Salary.objects.filter(
        occupation__name=occupation,
        education_level__name=education,
        experience_level__name=experience
    ).select_related(
        'occupation', 'education_level', 'experience_level'
    )