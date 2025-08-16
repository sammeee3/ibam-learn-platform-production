import React from 'react';
import { ThreeFishHeader } from '../shared/Navigation';

const FaithMetrics = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="equipDiscipleship" />
      
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-xl font-bold mb-2">Faith Metrics</h3>
        <p className="text-gray-600">This section is being built. Full functionality coming soon!</p>
      </div>
    </div>
  );
};

export default FaithMetrics;