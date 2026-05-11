import { useState } from 'react';
import Card from '../components/ui/Card';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How accurate is the salary data?',
      answer: 'Our data is sourced from verified job listings, surveys, and government statistics.',
    },
    {
      question: 'How often is the data updated?',
      answer: 'We update our data quarterly to ensure accuracy and relevance.',
    },
    {
      question: 'Is the service free?',
      answer: 'Yes, basic salary lookups and affordability checks are completely free.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="cursor-pointer" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">{faq.question}</h3>
              <span className="text-gray-400">{openIndex === index ? '−' : '+'}</span>
            </div>
            {openIndex === index && (
              <p className="mt-3 text-gray-600">{faq.answer}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQ;