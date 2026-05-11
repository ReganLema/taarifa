import Card from '../components/ui/Card';

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <Card>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-4 text-gray-600">We value your privacy. This policy explains how we collect and use your data.</p>
      </Card>
    </div>
  );
};

export default Privacy;