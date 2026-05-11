import { useState, useMemo } from 'react';
import Card from '../../ui/Card';

interface TrendData {
  occupation: string;
  category: string;
  growthRate: number;
  demandScore: number;
  averageSalary: number;
  trend: 'up' | 'stable' | 'down';
  hotSkills: string[];
  openings: number;
  color: string;
  icon: string;
}

const trendData: TrendData[] = [
  {
    occupation: 'AI/Machine Learning Engineer',
    category: 'Technology',
    growthRate: 45,
    demandScore: 95,
    averageSalary: 4500000,
    trend: 'up',
    hotSkills: ['Python', 'TensorFlow', 'PyTorch', 'NLP'],
    openings: 500,
    color: '#8B5CF6',
    icon: '🤖',
  },
  {
    occupation: 'Cloud Solutions Architect',
    category: 'Technology',
    growthRate: 40,
    demandScore: 92,
    averageSalary: 4000000,
    trend: 'up',
    hotSkills: ['AWS', 'Azure', 'GCP', 'Terraform'],
    openings: 350,
    color: '#06B6D4',
    icon: '☁️',
  },
  {
    occupation: 'Cybersecurity Specialist',
    category: 'Technology',
    growthRate: 35,
    demandScore: 90,
    averageSalary: 3200000,
    trend: 'up',
    hotSkills: ['Penetration Testing', 'SIEM', 'Cloud Security'],
    openings: 400,
    color: '#10B981',
    icon: '🔒',
  },
  {
    occupation: 'Data Analyst',
    category: 'Technology',
    growthRate: 30,
    demandScore: 85,
    averageSalary: 2200000,
    trend: 'up',
    hotSkills: ['SQL', 'Power BI', 'Python', 'Excel'],
    openings: 600,
    color: '#3B82F6',
    icon: '📊',
  },
  {
    occupation: 'Digital Marketing Specialist',
    category: 'Marketing',
    growthRate: 25,
    demandScore: 80,
    averageSalary: 1800000,
    trend: 'up',
    hotSkills: ['SEO', 'Google Ads', 'Content Strategy'],
    openings: 450,
    color: '#EC4899',
    icon: '📱',
  },
  {
    occupation: 'Healthcare Administrator',
    category: 'Healthcare',
    growthRate: 28,
    demandScore: 82,
    averageSalary: 2500000,
    trend: 'up',
    hotSkills: ['Healthcare Mgmt', 'Compliance', 'Data Analysis'],
    openings: 300,
    color: '#F59E0B',
    icon: '🏥',
  },
  {
    occupation: 'Renewable Energy Engineer',
    category: 'Energy',
    growthRate: 50,
    demandScore: 88,
    averageSalary: 3500000,
    trend: 'up',
    hotSkills: ['Solar Design', 'Energy Storage', 'Project Mgmt'],
    openings: 200,
    color: '#10B981',
    icon: '🌱',
  },
  {
    occupation: 'Financial Analyst',
    category: 'Finance',
    growthRate: 15,
    demandScore: 75,
    averageSalary: 2000000,
    trend: 'stable',
    hotSkills: ['Financial Modeling', 'Excel', 'Bloomberg Terminal'],
    openings: 350,
    color: '#6366F1',
    icon: '💹',
  },
  {
    occupation: 'Software Developer',
    category: 'Technology',
    growthRate: 32,
    demandScore: 88,
    averageSalary: 2500000,
    trend: 'up',
    hotSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
    openings: 700,
    color: '#3B82F6',
    icon: '💻',
  },
  {
    occupation: 'Project Manager',
    category: 'Management',
    growthRate: 20,
    demandScore: 78,
    averageSalary: 2800000,
    trend: 'up',
    hotSkills: ['Agile', 'Scrum', 'Stakeholder Mgmt', 'JIRA'],
    openings: 400,
    color: '#F59E0B',
    icon: '📋',
  },
  {
    occupation: 'Electrical Engineer',
    category: 'Engineering',
    growthRate: 18,
    demandScore: 72,
    averageSalary: 2200000,
    trend: 'stable',
    hotSkills: ['AutoCAD', 'PLC Programming', 'Power Systems'],
    openings: 250,
    color: '#EF4444',
    icon: '⚡',
  },
  {
    occupation: 'UX/UI Designer',
    category: 'Technology',
    growthRate: 28,
    demandScore: 82,
    averageSalary: 2000000,
    trend: 'up',
    hotSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    openings: 350,
    color: '#EC4899',
    icon: '🎨',
  },
];

interface HotSkill {
  name: string;
  count: number;
  growth: number;
  category: string;
  icon: string;
}

const hotSkills: HotSkill[] = [
  { name: 'Python Programming', count: 850, growth: 40, category: 'Programming', icon: '🐍' },
  { name: 'Cloud Computing (AWS/Azure)', count: 780, growth: 55, category: 'Infrastructure', icon: '☁️' },
  { name: 'Data Analysis & Visualization', count: 720, growth: 35, category: 'Data', icon: '📊' },
  { name: 'Cybersecurity & Network Security', count: 650, growth: 50, category: 'Security', icon: '🔒' },
  { name: 'AI & Machine Learning', count: 580, growth: 60, category: 'AI', icon: '🤖' },
  { name: 'Project Management (Agile/Scrum)', count: 550, growth: 20, category: 'Management', icon: '📋' },
  { name: 'Digital Marketing & SEO', count: 500, growth: 30, category: 'Marketing', icon: '📱' },
  { name: 'DevOps & CI/CD', count: 480, growth: 45, category: 'Infrastructure', icon: '⚙️' },
  { name: 'Mobile App Development', count: 420, growth: 25, category: 'Development', icon: '📱' },
  { name: 'Blockchain Technology', count: 350, growth: 65, category: 'Emerging Tech', icon: '⛓️' },
];

type TabType = 'trending' | 'skills' | 'insights';

const JobTrendAnalysis = () => {
  const [activeTab, setActiveTab] = useState<TabType>('trending');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const maxGrowthRate = Math.max(...trendData.map(d => d.growthRate));
  const maxDemandScore = 100;
  const maxSkillCount = Math.max(...hotSkills.map(s => s.count));

  const totalOpenings = trendData.reduce((sum, j) => sum + j.openings, 0);
  const growingFields = trendData.filter(j => j.trend === 'up').length;
  const totalIndustries = new Set(trendData.map(j => j.category)).size;

  const tabs = [
    { key: 'trending' as TabType, label: '📈 Trending Jobs', count: trendData.length },
    { key: 'skills' as TabType, label: '🔥 Hot Skills', count: hotSkills.length },
    { key: 'insights' as TabType, label: '💡 Market Insights', count: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative ${
              activeTab === tab.key
                ? 'text-blue-600 bg-white border-t border-l border-r border-gray-200'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalOpenings.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Total Openings</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{growingFields}</p>
          <p className="text-xs text-gray-600">Growing Fields</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{totalIndustries}</p>
          <p className="text-xs text-gray-600">Industries</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {trendData.filter(j => j.trend === 'up').length}
          </p>
          <p className="text-xs text-gray-600">Growing Roles</p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Trending Jobs Tab */}
        {activeTab === 'trending' && (
          <div className="space-y-4">
            {/* Top Growing Jobs */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Fastest Growing Occupations
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {[...trendData]
                  .sort((a, b) => b.growthRate - a.growthRate)
                  .slice(0, 8)
                  .map((job) => (
                    <div
                      key={job.occupation}
                      className="p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{job.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{job.occupation}</p>
                            <p className="text-xs text-gray-400">{job.category}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          job.trend === 'up' ? 'bg-green-100 text-green-700' : 
                          job.trend === 'down' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {job.trend === 'up' ? '↑' : job.trend === 'down' ? '↓' : '→'} {job.growthRate}%
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Growth Rate</span>
                          <span className="font-medium">{job.growthRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${(job.growthRate / maxGrowthRate) * 100}%`,
                              backgroundColor: job.color,
                            }}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {formatCurrency(job.averageSalary)}/mo
                          </span>
                          <span className="text-xs text-gray-400">
                            {job.openings} openings
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* All Jobs Table */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">All Tracked Jobs</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Occupation</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Category</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Avg Salary</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Growth</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Demand</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Openings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendData.map((job) => (
                      <tr key={job.occupation} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <span className="font-medium text-gray-900">{job.occupation}</span>
                        </td>
                        <td className="py-2 px-3 text-gray-500">{job.category}</td>
                        <td className="py-2 px-3 text-right font-medium">
                          {formatCurrency(job.averageSalary)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className={`font-medium ${
                            job.growthRate > 30 ? 'text-green-600' : 
                            job.growthRate > 15 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {job.growthRate}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${(job.demandScore / maxDemandScore) * 100}%`,
                                  backgroundColor: job.color,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{job.demandScore}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right text-gray-600">{job.openings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Hot Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {hotSkills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{skill.icon}</span>
                    <span className="text-xs font-medium text-green-600">
                      +{skill.growth}%
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm mb-1">{skill.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{skill.category}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Demand</span>
                      <span>{skill.count} jobs</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${(skill.count / maxSkillCount) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Rank Badge */}
                  {index < 3 && (
                    <div className="mt-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        #{index + 1} Most Wanted
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Insight Cards */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Tech Sector Boom</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Technology sector is growing 35% faster than other industries in Tanzania. 
                      Software development, data science, and cybersecurity lead the growth.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-blue-200 text-blue-700 rounded-full">+35% YoY</span>
                      <span className="text-gray-500">Source: Industry Report 2024</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🎓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Skills Premium</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Digital skills certification increases salary by 25-40%. 
                      Cloud certifications (AWS/Azure) command the highest premium.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-green-200 text-green-700 rounded-full">+40%</span>
                      <span className="text-gray-500">Salary Boost</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🌍</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Remote Work Revolution</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Remote work opportunities increased by 200% since 2020. 
                      Tech roles lead with 65% offering remote/hybrid options.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-purple-200 text-purple-700 rounded-full">+200%</span>
                      <span className="text-gray-500">Since 2020</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💼</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Hybrid Skills Premium</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Professionals with Tech + Business skills earn 30% more. 
                      Most valued combination: Technical expertise + project management.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-orange-200 text-orange-700 rounded-full">+30%</span>
                      <span className="text-gray-500">Salary Premium</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTrendAnalysis;