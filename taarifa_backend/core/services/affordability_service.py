from core.models import CostOfLiving

def calculate_affordability(salary_data, location_name):
    """
    Calculate affordability based on salary and cost of living data.
    Returns detailed breakdown of expenses, savings, and affordability rating.
    """
    location_name = location_name.strip()

    try:
        cost = CostOfLiving.objects.select_related('location').get(
            location__name__iexact=location_name
        )
    except CostOfLiving.DoesNotExist:
        return {
            "success": False,
            "message": f"No cost data found for '{location_name}'"
        }

    avg_salary = (float(salary_data["min_salary"]) + float(salary_data["max_salary"])) / 2

    # Calculate expenses
    rent = avg_salary * (cost.rent_percent / 100)
    food = avg_salary * (cost.food_percent / 100)
    transport = avg_salary * (cost.transport_percent / 100)
    utility = avg_salary * (cost.utility_percent / 100)
    
    total_expense = rent + food + transport + utility
    total_expense_percent = cost.rent_percent + cost.food_percent + cost.transport_percent + cost.utility_percent
    
    savings = avg_salary - total_expense
    savings_percent = round((savings / avg_salary) * 100, 2) if avg_salary > 0 else 0
    
    # Determine affordability rating
    if savings_percent >= 30:
        affordability = "Excellent"
    elif savings_percent >= 20:
        affordability = "Good"
    elif savings_percent >= 10:
        affordability = "Moderate"
    elif savings_percent >= 0:
        affordability = "Tight"
    else:
        affordability = "Cost exceeds salary"
    
    # Calculate disposable income
    disposable_income = round(savings * 0.7, 2)  # 70% of savings for discretionary spending
    emergency_fund = round(savings * 0.3, 2)     # 30% of savings for emergency fund

    return {
        "success": True,
        "location": cost.location.name,
        "salary": {
            "min": float(salary_data["min_salary"]),
            "max": float(salary_data["max_salary"]),
            "average": round(avg_salary, 2)
        },
        "expenses": {
            "rent": {
                "amount": round(rent, 2),
                "percent": cost.rent_percent
            },
            "food": {
                "amount": round(food, 2),
                "percent": cost.food_percent
            },
            "transport": {
                "amount": round(transport, 2),
                "percent": cost.transport_percent
            },
            "utility": {
                "amount": round(utility, 2),
                "percent": cost.utility_percent
            },
            "total": {
                "amount": round(total_expense, 2),
                "percent": total_expense_percent
            }
        },
        "savings": {
            "amount": round(savings, 2),
            "percent": savings_percent,
            "disposable_income": disposable_income,
            "emergency_fund": emergency_fund
        },
        "affordability_rating": affordability,
        "summary": f"In {cost.location.name}, you can save {savings_percent}% of your salary. This is considered '{affordability}' affordability."
    }