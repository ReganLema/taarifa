from core.selectors.salary_selector import get_salary_by_filters

def get_salary_range(data):
    queryset = get_salary_by_filters(
        occupation=data.get("occupation"),
        education=data.get("education"),
        experience=data.get("experience"),
    )

    if not queryset.exists():
        return {
            "success": False,
            "message": "No data found"
        }

    results = []
    for item in queryset:
        results.append({
            "occupation": item.occupation.name,
            "education": item.education_level.name,
            "experience": item.experience_level.name,
            "min_salary": item.min_salary,
            "max_salary": item.max_salary,
        })

    return {
        "success": True,
        "data": results
    }