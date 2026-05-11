import Card from '../components/ui/Card';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Taarifa</h1>
      
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          Taarifa is dedicated to providing accurate and up-to-date salary information 
          and cost of living data across Tanzania. We help professionals make informed 
          career decisions by offering transparent salary comparisons and affordability analyses.
        </p>
      </Card>

      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">What We Offer</h2>
        <ul className="space-y-3 text-gray-600">
          <li>✅ Salary data for 200+ occupations</li>
          <li>✅ Cost of living data for 22 major cities</li>
          <li>✅ Affordability calculations</li>
          <li>✅ Career insights and trends</li>
        </ul>
      </Card>
    </div>
  );
};

export default About;