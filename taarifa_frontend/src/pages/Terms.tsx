import Card from '../components/ui/Card';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <Card>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-4 text-gray-600">By using Taarifa, you agree to these terms and conditions.</p>
      </Card>
    </div>
  );
};

export default Terms;