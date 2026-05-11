export interface AffordabilityInput {
  occupation: string;
  education: string;
  experience: string;
  location: string;
}

export interface ExpenseBreakdown {
  amount: number;
  percent: number;
}

export interface SalaryRange {
  min: number;
  max: number;
  average: number;
}

export interface SavingsData {
  amount: number;
  percent: number;
  disposableIncome: number;
  emergencyFund: number;
}

export interface AffordabilityData {
  location: string;
  salary: SalaryRange;
  expenses: {
    rent: ExpenseBreakdown;
    food: ExpenseBreakdown;
    transport: ExpenseBreakdown;
    utility: ExpenseBreakdown;
    total: ExpenseBreakdown;
  };
  savings: SavingsData;
  affordabilityRating: 'Excellent' | 'Good' | 'Moderate' | 'Tight' | 'Critical';
  summary: string;
}