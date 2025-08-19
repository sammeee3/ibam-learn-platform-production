// components/sections/FaithDrivenPurpose.jsx
// Faith-Driven Purpose section component

import React from 'react';
import { colors } from '../../config/constants';
import { ThreeFishHeader } from '../shared/Navigation';
import { FieldWithTooltip, TextArea } from '../shared/FormComponents';

const FaithDrivenPurpose = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="equipDiscipleship" />
      
      <div className="bg-blue-50 rounded-xl p-4 border-l-4" style={{ borderColor: colors.accent }}>
        <h3 className="font-bold mb-2" style={{ color: colors.accent }}>
          🙏 Define Your God-Given Purpose and Direction
        </h3>
        <p className="text-sm" style={{ color: colors.text }}>
          "In their hearts humans plan their course, but the LORD establishes their steps." - Proverbs 16:9
        </p>
      </div>

      <FieldWithTooltip fieldKey="visionStatement" label="Vision Statement ✨" required>
        <TextArea
          value={formData.visionStatement || ''}
          onChange={(value) => handleInputChange('visionStatement', value)}
          placeholder="What big thing is God calling you to accomplish through this business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="missionStatement" label="Mission Statement 🎯" required>
        <TextArea
          value={formData.missionStatement || ''}
          onChange={(value) => handleInputChange('missionStatement', value)}
          placeholder="How will you serve God and love others through this business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="faithDrivenImpact" label="Faith-Driven Impact 👑" required>
        <TextArea
          value={formData.faithDrivenImpact || ''}
          onChange={(value) => handleInputChange('faithDrivenImpact', value)}
          placeholder="How will this business help make disciples and serve God's purposes?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="discipleshipPlan" label="Discipleship Plan ⚡" required>
        <TextArea
          value={formData.discipleshipPlan || ''}
          onChange={(value) => handleInputChange('discipleshipPlan', value)}
          placeholder="How will you equip others for discipleship through your business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="biblicalFoundation" label="Biblical Foundation 📖" required>
        <TextArea
          value={formData.biblicalFoundation || ''}
          onChange={(value) => handleInputChange('biblicalFoundation', value)}
          placeholder="What Bible verses will guide your business decisions and practices?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="ethicalFramework" label="Ethical Decision Framework 🧭">
        <TextArea
          value={formData.ethicalFramework || ''}
          onChange={(value) => handleInputChange('ethicalFramework', value)}
          placeholder="When you face tough business decisions, how will you choose what's right?"
          rows={3}
        />
      </FieldWithTooltip>
    </div>
  );
};

export default FaithDrivenPurpose;