import React, { useState, useEffect } from 'react';
import { ProfileFormData, Address } from '../types/profile';

interface ProfileFormProps {
  initialData?: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
}

const emptyProfile: ProfileFormData = {
  name: '',
  photo: '',
  description: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    latitude: 0,
    longitude: 0
  },
  contactInfo: {
    email: '',
    phone: '',
    website: ''
  },
  interests: []
};

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData || emptyProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    setFormData(initialData || emptyProfile);
    setErrors({});
    setNewInterest('');
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      if (section === 'address' || section === 'contactInfo') {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...(prev[section as keyof ProfileFormData] as object || {}),
            [field]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() === '') return;
    
    setFormData(prev => ({
      ...prev,
      interests: [...(prev.interests || []), newInterest.trim()]
    }));
    
    setNewInterest('');
  };

  const handleRemoveInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors['name'] = 'Name is required';
    if (!formData.description.trim()) newErrors['description'] = 'Description is required';
    
    // Address validation
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Street is required';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
    if (!formData.address.zipCode.trim()) newErrors['address.zipCode'] = 'Zip code is required';
    if (!formData.address.country.trim()) newErrors['address.country'] = 'Country is required';
    
    // Coordinate validation
    if (isNaN(formData.address.latitude) || formData.address.latitude < -90 || formData.address.latitude > 90) {
      newErrors['address.latitude'] = 'Latitude must be between -90 and 90';
    }
    
    if (isNaN(formData.address.longitude) || formData.address.longitude < -180 || formData.address.longitude > 180) {
      newErrors['address.longitude'] = 'Longitude must be between -180 and 180';
    }
    
    // Email validation if provided
    if (formData.contactInfo?.email && !/^\S+@\S+\.\S+$/.test(formData.contactInfo.email)) {
      newErrors['contactInfo.email'] = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {initialData ? 'Edit Profile' : 'Create New Profile'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors['name'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors['name'] && (
              <p className="mt-1 text-sm text-red-600">{errors['name']}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <input
              type="text"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border ${errors['description'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors['description'] && (
              <p className="mt-1 text-sm text-red-600">{errors['description']}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interests
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add an interest"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.interests?.map((interest, index) => (
                <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact & Location</h3>
          
          <div className="mb-4">
            <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="contactInfo.email"
              name="contactInfo.email"
              value={formData.contactInfo?.email || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors['contactInfo.email'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors['contactInfo.email'] && (
              <p className="mt-1 text-sm text-red-600">{errors['contactInfo.email']}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              id="contactInfo.phone"
              name="contactInfo.phone"
              value={formData.contactInfo?.phone || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="contactInfo.website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="text"
              id="contactInfo.website"
              name="contactInfo.website"
              value={formData.contactInfo?.website || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors['address.street'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors['address.street'] && (
              <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors['address.city'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors['address.city'] && (
                <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>
              )}
            </div>
            <div>
              <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                State/Province *
              </label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors['address.state'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors['address.state'] && (
                <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                Zip/Postal Code *
              </label>
              <input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors['address.zipCode'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors['address.zipCode'] && (
                <p className="mt-1 text-sm text-red-600">{errors['address.zipCode']}</p>
              )}
            </div>
            <div>
              <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors['address.country'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors['address.country'] && (
                <p className="mt-1 text-sm text-red-600">{errors['address.country']}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="address.latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude *
              </label>
              <input
                type="number"
                step="0.000001"
                id="address.latitude"
                name="address.latitude"
                value={formData.address.latitude}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors['address.latitude'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors['address.latitude'] && (
                <p className="mt-1 text-sm text-red-600">{errors['address.latitude']}</p>
              )}
            </div>
            <div>
              <label htmlFor="address.longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude *
              </label>
              <input
                type="number"
                step="0.000001"
                id="address.longitude"
                name="address.longitude"
                value={formData.address.longitude}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors['address.longitude'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors['address.longitude'] && (
                <p className="mt-1 text-sm text-red-600">{errors['address.longitude']}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {initialData ? 'Update Profile' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
