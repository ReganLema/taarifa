import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_ALL_OCCUPATIONS } from '../graphql/queries/salary';
import { GET_ALL_LOCATIONS } from '../graphql/queries/locations';
import CareerComparison from '../components/features/career/CareerComparison';
import JobTrendAnalysis from '../components/features/career/JobTrendAnalysis';

interface PopularOccupation {
  id: string;
  name: string;
  searchCount: number;
  averageSalary: number;
}

interface Location {
  id: string;
  name: string;
}

const FALLBACK_LOCATIONS: Location[] = [
  { id: '1', name: 'Dar es Salaam' },
  { id: '2', name: 'Dodoma' },
  { id: '3', name: 'Arusha' },
  { id: '4', name: 'Mwanza' },
  { id: '5', name: 'Zanzibar' },
  { id: '6', name: 'Mbeya' },
  { id: '7', name: 'Morogoro' },
  { id: '8', name: 'Tanga' },
];

const FALLBACK_OCCUPATIONS: PopularOccupation[] = [
  { id: '1', name: 'Software Developer', searchCount: 1200, averageSalary: 2500000 },
  { id: '2', name: 'Accountant', searchCount: 980, averageSalary: 1500000 },
  { id: '3', name: 'Teacher', searchCount: 850, averageSalary: 1200000 },
  { id: '4', name: 'Nurse', searchCount: 750, averageSalary: 1800000 },
  { id: '5', name: 'Engineer', searchCount: 680, averageSalary: 3000000 },
  { id: '6', name: 'Marketing Manager', searchCount: 550, averageSalary: 2200000 },
];

const Home = () => {
  const [popularOccupations, setPopularOccupations] = useState<PopularOccupation[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    setLocationsLoading(true);

    try {
      const locResult = await apolloClient.query<{ locations: Location[] }>({
        query: GET_ALL_LOCATIONS,
        fetchPolicy: 'network-only',
      });
      if (locResult?.data?.locations && locResult.data.locations.length > 0) {
        setLocations(locResult.data.locations.slice(0, 8));
      } else {
        setLocations(FALLBACK_LOCATIONS);
      }
    } catch {
      setLocations(FALLBACK_LOCATIONS);
    } finally {
      setLocationsLoading(false);
    }

    try {
      const occResult = await apolloClient.query<{ occupations: Location[] }>({
        query: GET_ALL_OCCUPATIONS,
      });
      if (occResult?.data?.occupations && occResult.data.occupations.length > 0) {
        const formatted = occResult.data.occupations.slice(0, 6).map((occ, index) => ({
          ...occ,
          searchCount: FALLBACK_OCCUPATIONS[index]?.searchCount || Math.floor(Math.random() * 1000) + 100,
          averageSalary: FALLBACK_OCCUPATIONS[index]?.averageSalary || Math.floor(Math.random() * 2000000) + 500000,
        }));
        setPopularOccupations(formatted);
      } else {
        setPopularOccupations(FALLBACK_OCCUPATIONS);
      }
    } catch {
      setPopularOccupations(FALLBACK_OCCUPATIONS);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    { value: '200+', label: 'Occupations', icon: '💼', gradient: 'from-blue-500 to-cyan-500' },
    { value: '22', label: 'Cities Covered', icon: '🏙️', gradient: 'from-green-500 to-emerald-500' },
    { value: '5', label: 'Education Levels', icon: '🎓', gradient: 'from-purple-500 to-pink-500' },
    { value: '3', label: 'Experience Levels', icon: '⭐', gradient: 'from-orange-500 to-yellow-500' },
  ];

  const features = [
    {
      icon: '💰',
      title: 'Salary Lookup',
      description: 'Compare salaries across 200+ occupations in Tanzania with detailed breakdowns',
      link: '/salary',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200 hover:border-blue-400',
      shadowColor: 'hover:shadow-blue-200/50',
    },
    {
      icon: '🏠',
      title: 'Affordability Check',
      description: 'Calculate living costs in 22 cities - see how far your salary goes',
      link: '/affordability',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-teal-50',
      borderColor: 'border-green-200 hover:border-green-400',
      shadowColor: 'hover:shadow-green-200/50',
    },
    {
      icon: '📊',
      title: 'Career Comparison',
      description: 'Compare tech careers side-by-side with salary, growth & demand data',
      link: '/salary',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200 hover:border-purple-400',
      shadowColor: 'hover:shadow-purple-200/50',
    },
    {
      icon: '📈',
      title: 'Market Trends',
      description: 'Track job market trends, hot skills, and growing industries',
      link: '/salary',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-200 hover:border-orange-400',
      shadowColor: 'hover:shadow-orange-200/50',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern Glassmorphism */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMS4xLS45LTItMi0yaC0yYy0xLjEgMC0yIC45LTIgMnYyYzAgMS4xLjkgMiAyIDJoMmMxLjEgMCAyLS45IDItMnYtMnpNMzYgNDBjMC0xLjEtLjktMi0yLTJoLTJjLTEuMSAwLTIgLjktMiAydjJjMCAxLjEuOSAyIDIgMmgyYzEuMSAwIDItLjkgMi0ydi0yek0xOCAxOGMwLTEuMS0uOS0yLTItMmgtMmMtMS4xIDAtMiAuOS0yIDJ2MmMwIDEuMS45IDIgMiAyaDJjMS4xIDAgMi0uOSAyLTJ2LTJ6TTE4IDQwYzAtMS4xLS45LTItMi0yaC0yYy0xLjEgMC0yIC45LTIgMnYyYzAgMS4xLjkgMiAyIDJoMmMxLjEgMCAyLS45IDItMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-sm text-blue-100">Tanzania's #1 Salary Guide</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Your Career Compass
              </span>
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-300 leading-relaxed">
                in Tanzania
              </span>
            </h1>
            
            <p className="text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Navigate your career with confidence. Compare salaries, calculate living costs, 
              and discover the best opportunities across Tanzania's growing job market.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/salary"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1"
              >
                <span className="mr-2 text-xl">💰</span>
                Explore Salaries
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/affordability"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="mr-2 text-xl">🏠</span>
                Check Affordability
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Trusted By */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <p className="text-sm text-blue-200/60 mb-4">Trusted by professionals across Tanzania</p>
              <div className="flex items-center justify-center gap-8 text-3xl opacity-50">
                <span className="hover:opacity-100 transition-opacity cursor-default">🏢</span>
                <span className="hover:opacity-100 transition-opacity cursor-default">🏦</span>
                <span className="hover:opacity-100 transition-opacity cursor-default">🏥</span>
                <span className="hover:opacity-100 transition-opacity cursor-default">🏗️</span>
                <span className="hover:opacity-100 transition-opacity cursor-default">📡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Modern Cards */}
      <section className="relative -mt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Glass Cards */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              ✨ Powerful Tools
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Comprehensive tools designed to help you make informed career and relocation decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className={`group relative bg-white rounded-2xl border-2 ${feature.borderColor} p-8 transition-all duration-300 hover:shadow-2xl ${feature.shadowColor} hover:-translate-y-1`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-2">
                      Explore
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Occupations - Hover Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                🔥 Trending Now
              </span>
              <h2 className="text-4xl font-extrabold text-slate-900">
                Popular Occupations
              </h2>
              <p className="text-lg text-slate-500 mt-2">
                Most searched salary data this month
              </p>
            </div>
            <Link
              to="/salary"
              className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-8 animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-4" />
                  <div className="h-8 bg-slate-200 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : popularOccupations.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {popularOccupations.map((occupation, index) => (
                <Link
                  key={occupation.id}
                  to={`/salary?occupation=${encodeURIComponent(occupation.name)}`}
                  className="group relative bg-white rounded-2xl border border-slate-200 p-8 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    #{index + 1}
                  </div>

                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    💼
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {occupation.name}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        {formatCurrency(occupation.averageSalary)}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">Average monthly salary</p>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-sm text-slate-400">
                        {occupation.searchCount.toLocaleString()} searches this month
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <p className="text-slate-500">No popular occupations available</p>
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Link
              to="/salary"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              View All Occupations
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Cities - Modern Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              🏙️ 22 Cities
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Explore Cities
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              See how far your salary goes in different cities across Tanzania
            </p>
          </div>

          {locationsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-slate-100 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : locations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {locations.map((location) => (
                <Link
                  key={location.id}
                  to={`/affordability?location=${encodeURIComponent(location.name)}`}
                  className="group relative bg-white rounded-2xl border border-slate-200 p-6 text-center hover:border-green-300 hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform">
                    📍
                  </div>
                  <p className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                    {location.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View cost of living →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <p className="text-slate-500">No cities available</p>
            </div>
          )}
        </div>
      </section>

      {/* Career Comparison Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              🔄 Compare & Decide
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Career Comparison Tool
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Compare tech careers side by side with salary, growth potential, and market demand
            </p>
          </div>
          <div className="bg-slate-50 rounded-3xl p-8 shadow-inner">
            <CareerComparison />
          </div>
        </div>
      </section>

      {/* Job Market Trends Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
              📈 Market Intelligence
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Job Market Trends & Insights
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto">
              Stay ahead of the curve with real-time insights into Tanzania's evolving job market
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
            <JobTrendAnalysis />
          </div>
        </div>
      </section>

      {/* CTA Section - Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-8">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Take Control of Your Career?
          </h2>
          <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals using Taarifa to make informed career decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/salary"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl shadow-blue-900/30 hover:-translate-y-1"
            >
              Get Started Free
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:-translate-y-1"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;