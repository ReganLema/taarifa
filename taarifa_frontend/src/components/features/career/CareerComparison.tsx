import { useState, useMemo } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Select from '../../ui/Select';

interface CareerData {
  occupation: string;
  salary: number;
  growth: number;
  demand: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  skills: string[];
  color: string;
}

const careerData: CareerData[] = [
  {
    occupation: 'Software Developer',
    salary: 2500000,
    growth: 25,
    demand: 'High',
    difficulty: 'Hard',
    skills: ['JavaScript', 'Python', 'React', 'SQL'],
    color: '#3B82F6',
  },
  {
    occupation: 'Data Scientist',
    salary: 3000000,
    growth: 35,
    demand: 'High',
    difficulty: 'Expert',
    skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
    color: '#10B981',
  },
  {
    occupation: 'Network Engineer',
    salary: 2000000,
    growth: 15,
    demand: 'Medium',
    difficulty: 'Hard',
    skills: ['Cisco', 'Security', 'Cloud', 'Linux'],
    color: '#F59E0B',
  },
  {
    occupation: 'UI/UX Designer',
    salary: 1800000,
    growth: 20,
    demand: 'High',
    difficulty: 'Moderate',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    color: '#EC4899',
  },
  {
    occupation: 'Cybersecurity Analyst',
    salary: 2800000,
    growth: 30,
    demand: 'High',
    difficulty: 'Expert',
    skills: ['Security+', 'Ethical Hacking', 'SIEM', 'Network Security'],
    color: '#8B5CF6',
  },
  {
    occupation: 'Cloud Engineer',
    salary: 3500000,
    growth: 40,
    demand: 'High',
    difficulty: 'Hard',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
    color: '#06B6D4',
  },
];

const CareerComparison = () => {
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [compareBy, setCompareBy] = useState<'salary' | 'growth' | 'demand'>('salary');

  const maxCareers = 3;

  const toggleCareer = (occupation: string) => {
    setSelectedCareers(prev => {
      if (prev.includes(occupation)) {
        return prev.filter(c => c !== occupation);
      }
      if (prev.length >= maxCareers) {
        return [...prev.slice(1), occupation];
      }
      return [...prev, occupation];
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDemandColor = (demand: string): string => {
    switch (demand) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-blue-600 bg-blue-100';
      case 'Hard': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const selectedData = useMemo(() => 
    careerData.filter(c => selectedCareers.includes(c.occupation)),
    [selectedCareers]
  );

  // Calculate max value for chart scaling
  const maxSalary = Math.max(...careerData.map(c => c.salary));
  const maxGrowth = 50;

  return (
    <div className="space-y-6">
      {/* Career Selection */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Compare Tech Careers
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select up to {maxCareers} careers to compare (Click to select/deselect)
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {careerData.map((career) => (
            <button
              key={career.occupation}
              onClick={() => toggleCareer(career.occupation)}
              className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                selectedCareers.includes(career.occupation)
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {career.occupation}
            </button>
          ))}
        </div>

        {/* Comparison Mode */}
        <div className="flex gap-2">
          <Select
            options={[
              { value: 'salary', label: 'Compare Salary' },
              { value: 'growth', label: 'Compare Growth' },
              { value: 'demand', label: 'Compare Demand' },
            ]}
            value={compareBy}
            onChange={(e) => setCompareBy(e.target.value as 'salary' | 'growth' | 'demand')}
            placeholder="Compare by..."
          />
        </div>
      </Card>

      {/* Comparison Results */}
      {selectedData.length > 0 && (
        <div className="space-y-4">
          {/* Bar Chart */}
          <Card>
            <h4 className="font-semibold text-gray-900 mb-6">
              {compareBy === 'salary' ? '💰 Salary Comparison' :
               compareBy === 'growth' ? '📈 Growth Rate Comparison' :
               '🎯 Demand Level Comparison'}
            </h4>
            
            <div className="space-y-4">
              {selectedData.map((career) => {
                const barWidth = compareBy === 'salary'
                  ? (career.salary / maxSalary) * 100
                  : compareBy === 'growth'
                  ? (career.growth / maxGrowth) * 100
                  : career.demand === 'High' ? 100 : career.demand === 'Medium' ? 60 : 30;

                return (
                  <div key={career.occupation}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{career.occupation}</span>
                      <span className="text-gray-600">
                        {compareBy === 'salary' ? formatCurrency(career.salary) :
                         compareBy === 'growth' ? `${career.growth}% growth` :
                         `${career.demand} demand`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className="h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-xs text-white font-medium"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: career.color,
                        }}
                      >
                        {barWidth > 15 && `${Math.round(barWidth)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Detail Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {selectedData.map((career) => (
              <Card key={career.occupation} className="hover:shadow-lg transition-shadow">
                <div className="text-center mb-3">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: career.color }}
                  >
                    {career.occupation.charAt(0)}
                  </div>
                  <h4 className="font-semibold text-gray-900">{career.occupation}</h4>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Salary</span>
                    <span className="font-bold text-blue-600">{formatCurrency(career.salary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Growth</span>
                    <span className="font-bold text-green-600">{career.growth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Demand</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDemandColor(career.demand)}`}>
                      {career.demand}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Difficulty</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(career.difficulty)}`}>
                      {career.difficulty}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-1">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {career.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedData.length === 0 && (
        <Card className="text-center py-8">
          <div className="text-4xl mb-3">👆</div>
          <p className="text-gray-500">Select careers above to start comparing</p>
        </Card>
      )}
    </div>
  );
};

export default CareerComparison;