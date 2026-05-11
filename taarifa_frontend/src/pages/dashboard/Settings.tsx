import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    salaryAlerts: true,
    newsletterSubscription: false,
    language: 'en',
    currency: 'TZS',
    theme: 'light',
    privacyMode: false,
  });

  const handleToggle = (field: string) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Notification Settings */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
        
        <div className="space-y-4">
          {[
            {
              label: 'Email Notifications',
              description: 'Receive email notifications about your account activity',
              field: 'emailNotifications',
            },
            {
              label: 'Salary Alerts',
              description: 'Get notified when new salary data is added for your occupation',
              field: 'salaryAlerts',
            },
            {
              label: 'Newsletter',
              description: 'Receive our monthly newsletter with salary trends and tips',
              field: 'newsletterSubscription',
            },
          ].map((item) => (
            <div key={item.field} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                onClick={() => handleToggle(item.field)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.field as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[item.field as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Language"
            value={settings.language}
            onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
            options={[
              { value: 'en', label: 'English' },
              { value: 'sw', label: 'Swahili' },
            ]}
          />
          <Select
            label="Currency"
            value={settings.currency}
            onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
            options={[
              { value: 'TZS', label: 'TZS - Tanzanian Shilling' },
              { value: 'USD', label: 'USD - US Dollar' },
            ]}
          />
          <Select
            label="Theme"
            value={settings.theme}
            onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
            options={[
              { value: 'light', label: '☀️ Light' },
              { value: 'dark', label: '🌙 Dark' },
              { value: 'system', label: '💻 System' },
            ]}
          />
        </div>
      </Card>

      {/* Privacy */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Privacy Mode</p>
            <p className="text-sm text-gray-500">Hide your profile from public search results</p>
          </div>
          <button
            onClick={() => handleToggle('privacyMode')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.privacyMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.privacyMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={loading}>
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;