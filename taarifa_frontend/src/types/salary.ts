import { BaseEntity } from './common';

export interface Salary extends BaseEntity {
  occupation: Occupation;
  educationLevel: EducationLevel;
  experienceLevel: ExperienceLevel;
  location?: Location;
  minSalary: number;
  maxSalary: number;
}

export interface Occupation {
  id: string;
  name: string;
}

export interface EducationLevel {
  id: string;
  name: string;
}

export interface ExperienceLevel {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface SalaryRangeInput {
  occupation: string;
  education: string;
  experience: string;
}

export interface SalaryRangeResult {
  occupation: string;
  education: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
}