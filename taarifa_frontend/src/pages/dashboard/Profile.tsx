import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import toast from 'react-hot-toast';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+255 123 456 789',
    location: 'Dar es Salaam',
    occupation: 'Software Developer',
    education: 'Bachelor',
    experience: 'Mid Level',
    bio: 'Experienced software developer with 5 years in the industry.',
  });

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Profile updated successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4 pb-6 border-b">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 mt-1">
                Change Photo
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              disabled
            />
            <Input
              label="Phone Number"
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            <Input
              label="Location"
              value={profile.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
            <Input
              label="Occupation"
              value={profile.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
            />
            <Input
              label="Education"
              value={profile.education}
              onChange={(e) => handleChange('education', e.target.value)}
            />
            <Input
              label="Experience Level"
              value={profile.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
            />
            <Select
              label="Language"
              options={[
                { value: 'en', label: 'English' },
                { value: 'sw', label: 'Swahili' },
              ]}
              value="en"
              onChange={() => {}}
            />
          </div>

          <div>
            <Input
              label="Bio"
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              helperText="Brief description for your profile"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="danger" size="sm">
          Delete Account
        </Button>
      </Card>
    </div>
  );
};

export default Profile;