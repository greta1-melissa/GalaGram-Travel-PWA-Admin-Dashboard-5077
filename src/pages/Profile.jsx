import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMapPin, FiCamera, FiEdit, FiSave, FiX, FiHeart } = FiIcons;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });

  const [photos, setPhotos] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      caption: 'Beautiful sunset at Boracay',
      location: 'Boracay, Aklan',
      likes: 24
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop',
      caption: 'Crystal clear waters of Palawan',
      location: 'El Nido, Palawan',
      likes: 18
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      caption: 'Rice terraces adventure',
      location: 'Banaue, Ifugao',
      likes: 31
    }
  ]);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      location: user?.location || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Header */}
        <div className="glass-effect rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="w-16 h-16 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <SafeIcon icon={FiCamera} className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Last Name"
                    />
                  </div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Location"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiSave} className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    {user?.bio || 'Travel enthusiast exploring the Philippines'}
                  </p>
                  {user?.location && (
                    <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex justify-center md:justify-start space-x-6 text-sm text-gray-600 mb-4">
                    <div className="text-center">
                      <span className="block font-semibold text-gray-800">{photos.length}</span>
                      <span>Photos</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-semibold text-gray-800">12</span>
                      <span>Trips</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-semibold text-gray-800">156</span>
                      <span>Followers</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="glass-effect rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">My Travel Photos</h2>
            <button className="btn-primary flex items-center space-x-2">
              <SafeIcon icon={FiCamera} className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="relative group rounded-lg overflow-hidden card-hover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white w-full">
                    <p className="font-medium mb-1">{photo.caption}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1" />
                        <span>{photo.location}</span>
                      </div>
                      <div className="flex items-center">
                        <SafeIcon icon={FiHeart} className="w-3 h-3 mr-1" />
                        <span>{photo.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;