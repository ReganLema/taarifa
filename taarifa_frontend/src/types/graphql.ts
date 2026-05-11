// ============================================
// GraphQL Response Types
// ============================================

// Base response interface
export interface GraphQLResponse {
  success: boolean;
  message?: string;
}

// Pagination
export interface PageInfo {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  edges: {
    node: T;
    cursor: string;
  }[];
  pageInfo: PageInfo;
}

// ============================================
// Salary Types
// ============================================

export interface SalaryData {
  occupation: string;
  education: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
}

export interface SalaryRangeResponse extends GraphQLResponse {
  data?: SalaryData[];
}

export interface SalaryRangeQueryResponse {
  salaryRange: SalaryRangeResponse;
}

// Detailed salary with statistics
export interface SalaryStatistics extends SalaryData {
  medianSalary: number;
  averageSalary: number;
  sampleSize: number;
  confidenceLevel: number;
}

export interface SalaryStatisticsResponse extends GraphQLResponse {
  data?: SalaryStatistics;
}

export interface SalaryStatisticsQueryResponse {
  salaryStatistics: SalaryStatisticsResponse;
}

// Salary trends
export interface SalaryTrend {
  year: number;
  quarter: number;
  minSalary: number;
  maxSalary: number;
  averageSalary: number;
}

export interface SalaryTrendsResponse extends GraphQLResponse {
  data?: SalaryTrend[];
}

export interface SalaryTrendsQueryResponse {
  salaryTrends: SalaryTrendsResponse;
}

// ============================================
// Entity Types (Occupations, Education, Experience)
// ============================================

export interface Entity {
  id: string;
  name: string;
}

export interface OccupationsQueryResponse {
  occupations: Entity[];
}

export interface EducationLevelsQueryResponse {
  educationLevels: Entity[];
}

export interface ExperienceLevelsQueryResponse {
  experienceLevels: Entity[];
}

// Popular occupation
export interface PopularOccupation extends Entity {
  searchCount: number;
  averageSalary: number;
}

export interface PopularOccupationsQueryResponse {
  popularOccupations: PopularOccupation[];
}

// Occupation search
export interface OccupationSearchResult extends Entity {
  category?: string;
}

export interface SearchOccupationsQueryResponse {
  searchOccupations: OccupationSearchResult[];
}

// ============================================
// Location Types
// ============================================

export interface Location {
  id: string;
  name: string;
}

export interface LocationsQueryResponse {
  locations: Location[];
}

export interface LocationDetail extends Location {
  region?: string;
  population?: number;
  costOfLivingIndex?: number;
}

export interface LocationDetailQueryResponse {
  locationDetail: LocationDetail;
}

// ============================================
// Affordability Types
// ============================================

export interface ExpenseBreakdown {
  amount: number;
  percent: number;
}

export interface AffordabilityExpenses {
  rent: ExpenseBreakdown;
  food: ExpenseBreakdown;
  transport: ExpenseBreakdown;
  utility: ExpenseBreakdown;
  total: ExpenseBreakdown;
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
  expenses: AffordabilityExpenses;
  savings: SavingsData;
  affordabilityRating: 'Excellent' | 'Good' | 'Moderate' | 'Tight' | 'Critical';
  summary: string;
}

export interface AffordabilityResponse extends GraphQLResponse {
  location?: string;
  salary?: SalaryRange;
  expenses?: AffordabilityExpenses;
  savings?: SavingsData;
  affordabilityRating?: string;
  summary?: string;
}

export interface AffordabilityQueryResponse {
  calculateAffordability: AffordabilityResponse;
}

// ============================================
// Cost of Living Types
// ============================================

export interface CostOfLiving {
  id: string;
  location: string;
  rentPercent: number;
  foodPercent: number;
  transportPercent: number;
  utilityPercent: number;
  otherPercent?: number;
  totalMonthlyEstimate?: number;
  currency?: string;
  lastUpdated?: string;
  dataSource?: string;
}

export interface CostOfLivingQueryResponse {
  costOfLiving: CostOfLiving;
}

export interface LocationCostOfLivingQueryResponse {
  locationCostOfLiving: CostOfLiving;
}

// ============================================
// Mutation Types
// ============================================

// Submit salary
export interface SalaryInput {
  occupation: string;
  education: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  location?: string;
  companySize?: string;
  industry?: string;
}

export interface SubmitSalaryResponse extends GraphQLResponse {
  data?: SalaryData;
}

export interface SubmitSalaryMutationResponse {
  submitUserSalary: SubmitSalaryResponse;
}

// Favorite salary
export interface FavoriteSalary {
  id: string;
  occupation: string;
  education: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  savedAt: string;
}

export interface SaveFavoriteResponse extends GraphQLResponse {
  favoriteId?: string;
}

export interface SaveFavoriteMutationResponse {
  saveToFavorites: SaveFavoriteResponse;
}

export interface RemoveFavoriteResponse extends GraphQLResponse {}

export interface RemoveFavoriteMutationResponse {
  removeFromFavorites: RemoveFavoriteResponse;
}

export interface FavoriteSalariesQueryResponse {
  favoriteSalaries: FavoriteSalary[];
}

// Salary review
export interface SalaryReview {
  id: string;
  rating: number;
  comment?: string;
  isAccurate: boolean;
  createdAt: string;
}

export interface SubmitReviewResponse extends GraphQLResponse {
  review?: SalaryReview;
}

export interface SubmitReviewMutationResponse {
  submitSalaryReview: SubmitReviewResponse;
}

// Report salary
export interface ReportSalaryResponse extends GraphQLResponse {
  reportId?: string;
}

export interface ReportSalaryMutationResponse {
  reportIncorrectSalary: ReportSalaryResponse;
}

// Bulk import
export interface BulkImportError {
  row: number;
  message: string;
}

export interface BulkImportResponse extends GraphQLResponse {
  count?: number;
  errors?: BulkImportError[];
}

export interface BulkImportMutationResponse {
  bulkImportSalaries: BulkImportResponse;
}

// ============================================
// Auth Types
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  token?: string;
}

export interface LoginMutationResponse {
  login: AuthResponse;
}

export interface RegisterMutationResponse {
  register: AuthResponse;
}

export interface VerifyTokenQueryResponse {
  verifyToken: {
    valid: boolean;
    user?: AuthUser;
  };
}

// ============================================
// User Types
// ============================================

export interface UserProfile extends AuthUser {
  phone?: string;
  location?: string;
  occupation?: string;
  education?: string;
  experience?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileQueryResponse {
  userProfile: UserProfile;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  location?: string;
  occupation?: string;
  education?: string;
  experience?: string;
  bio?: string;
}

export interface UpdateProfileResponse extends GraphQLResponse {
  user?: UserProfile;
}

export interface UpdateProfileMutationResponse {
  updateProfile: UpdateProfileResponse;
}

// User preferences
export interface UserPreferences {
  id: string;
  emailNotifications: boolean;
  salaryAlerts: boolean;
  newsletterSubscription: boolean;
  language: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  privacyMode: boolean;
}

export interface UserPreferencesQueryResponse {
  userPreferences: UserPreferences;
}

export interface UpdatePreferencesInput {
  emailNotifications?: boolean;
  salaryAlerts?: boolean;
  newsletterSubscription?: boolean;
  language?: string;
  currency?: string;
  theme?: string;
  privacyMode?: boolean;
}

export interface UpdatePreferencesResponse extends GraphQLResponse {
  preferences?: UserPreferences;
}

export interface UpdatePreferencesMutationResponse {
  updatePreferences: UpdatePreferencesResponse;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon?: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  recentSearches: RecentSearch[];
  popularOccupations: PopularOccupation[];
}

export interface RecentSearch {
  id: string;
  occupation: string;
  education: string;
  experience: string;
  date: string;
  results?: number;
}

export interface DashboardQueryResponse {
  dashboard: DashboardData;
}

// ============================================
// Query/Mutation Variables
// ============================================

export interface SalaryRangeVariables {
  occupation: string;
  education: string;
  experience: string;
}

export interface AffordabilityVariables extends SalaryRangeVariables {
  location: string;
}

export interface PaginationVariables {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

export interface SalaryFilters {
  occupation?: string;
  education?: string;
  experience?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
}

export interface PaginatedSalaryVariables extends PaginationVariables {
  filters?: SalaryFilters;
  sortBy?: 'occupation' | 'minSalary' | 'maxSalary' | 'experience';
  sortDirection?: 'ASC' | 'DESC';
}

export interface SearchOccupationsVariables {
  searchTerm: string;
  limit?: number;
}

export interface PopularOccupationsVariables {
  limit?: number;
}

export interface SalaryStatisticsVariables {
  occupation: string;
  education?: string;
  experience?: string;
}

export interface SalaryTrendsVariables {
  occupation: string;
  years?: number;
}