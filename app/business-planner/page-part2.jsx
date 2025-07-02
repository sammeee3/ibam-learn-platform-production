'use client';
import { renderFinancial } from './page-part2';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Package,
  Calendar,
  Settings,
  TrendingUp,
  BarChart3,
  Plus,
  Trash2,
  DollarSign
} from 'lucide-react';

// Export the renderFinancial function
export const renderFinancial = ({
  formData,
  handleInputChange,
  calculateProjections,
  formatCurrencyString,
  colors,
  addCustomCost,
  removeCustomCost,
  addProductService,
  FieldWithTooltip,
  CurrencyInput,
  ThreeFishHeader,
  ChallengeQuestions,
  setFormData
}) => {
  const projections = calculateProjections();
  const totalStartupCosts = Object.values(formData.financial.startupCosts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  
  // Calculate total fixed costs
  const standardFixedCosts = Object.entries(formData.financial.fixedCosts)
    .filter(([key]) => key !== 'custom')
    .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
  
  const customFixedCosts = (formData.financial.fixedCosts.custom || [])
    .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
  
  const totalFixedCosts = standardFixedCosts + customFixedCosts;
  
  // Calculate total variable costs
  const standardVariableCosts = Object.entries(formData.financial.variableCosts)
    .filter(([key]) => key !== 'custom')
    .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
  
  const customVariableCosts = (formData.financial.variableCosts.custom || [])
    .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
  
  const totalVariableCosts = standardVariableCosts + customVariableCosts;
  
  // Find break-even month
  const breakEvenMonth = projections.findIndex(month => month.profit >= 0) + 1;
  
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        <ThreeFishHeader fishApproach="giveFish" />
        <ChallengeQuestions />
        
        {/* Financial Settings */}
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Financial Planning Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWithTooltip fieldKey="bootstrapBudget" label="💰 How much money do you have to start?">
              <CurrencyInput
                value={formData.financial.bootstrapBudget}
                onChange={(value) => handleInputChange('financial', 'bootstrapBudget', value)}
                placeholder="5,000"
                style={{ borderColor: colors.border }}
              />
            </FieldWithTooltip>
            
            <FieldWithTooltip fieldKey="salesGrowthRate" label="📈 Expected monthly sales growth %">
              <input
                type="number"
                value={formData.financial.salesGrowthRate}
                onChange={(e) => handleInputChange('financial', 'salesGrowthRate', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                style={{ borderColor: colors.border }}
                placeholder="10"
                step="0.5"
              />
            </FieldWithTooltip>
            
            <FieldWithTooltip fieldKey="inflationRate" label="💸 Annual inflation rate %">
              <input
                type="number"
                value={formData.financial.inflationRate}
                onChange={(e) => handleInputChange('financial', 'inflationRate', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                style={{ borderColor: colors.border }}
                placeholder="3.5"
                step="0.5"
              />
            </FieldWithTooltip>
            
            <FieldWithTooltip fieldKey="salaryIncreaseRate" label="👥 Annual salary increase %">
              <input
                type="number"
                value={formData.financial.salaryIncreaseRate}
                onChange={(e) => handleInputChange('financial', 'salaryIncreaseRate', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                style={{ borderColor: colors.border }}
                placeholder="4"
                step="0.5"
              />
            </FieldWithTooltip>
          </div>
        </div>

        {/* Startup Costs */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            One-Time Startup Costs
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.financial.startupCosts).map(([key, value]) => (
              <FieldWithTooltip key={key} fieldKey={key} label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}>
                <CurrencyInput
                  value={value}
                  onChange={(newValue) => handleInputChange('financial', 'startupCosts', newValue, key)}
                  placeholder="0"
                  style={{ borderColor: colors.border }}
                />
              </FieldWithTooltip>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border" style={{ borderColor: colors.primary }}>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Startup Investment:</span>
              <span className="text-xl font-bold" style={{ color: colors.primary }}>
                {formatCurrencyString(totalStartupCosts)}
              </span>
            </div>
            {totalStartupCosts > formData.financial.bootstrapBudget && (
              <div className="mt-2 text-sm text-red-600">
                ⚠️ Over budget by {formatCurrencyString(totalStartupCosts - formData.financial.bootstrapBudget)}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Monthly Costs */}
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Fixed Monthly Costs
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.financial.fixedCosts)
              .filter(([key]) => key !== 'custom')
              .map(([key, value]) => (
                <FieldWithTooltip key={key} fieldKey={key} label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}>
                  <CurrencyInput
                    value={value}
                    onChange={(newValue) => handleInputChange('financial', 'fixedCosts', newValue, key)}
                    placeholder="0"
                    style={{ borderColor: colors.border }}
                  />
                </FieldWithTooltip>
              ))}
          </div>
          
          {/* Custom Fixed Costs */}
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-green-700">Custom Fixed Costs</h4>
            {(formData.financial.fixedCosts.custom || []).map(cost => (
              <div key={cost.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={cost.name}
                  onChange={(e) => {
                    const updatedCustom = formData.financial.fixedCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, name: e.target.value } : c
                    );
                    handleInputChange('financial', 'fixedCosts', updatedCustom, 'custom');
                  }}
                  className="flex-1 p-2 border rounded text-sm"
                  placeholder="Cost name"
                />
                <CurrencyInput
                  value={cost.amount}
                  onChange={(newValue) => {
                    const updatedCustom = formData.financial.fixedCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, amount: newValue } : c
                    );
                    handleInputChange('financial', 'fixedCosts', updatedCustom, 'custom');
                  }}
                  placeholder="0"
                  style={{ borderColor: colors.border }}
                />
                <button
                  onClick={() => removeCustomCost('fixedCosts', cost.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addCustomCost('fixedCosts')}
              className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Fixed Cost</span>
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border" style={{ borderColor: colors.secondary }}>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Fixed Monthly Costs:</span>
              <span className="text-xl font-bold" style={{ color: colors.secondary }}>
                {formatCurrencyString(totalFixedCosts)}
              </span>
            </div>
          </div>
        </div>

        {/* Variable Costs */}
        <div className="bg-orange-50 rounded-xl p-4">
          <h3 className="font-bold text-orange-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Variable Costs (Scale with Sales)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.financial.variableCosts)
              .filter(([key]) => key !== 'custom')
              .map(([key, value]) => (
                <FieldWithTooltip key={key} fieldKey={key} label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}>
                  <CurrencyInput
                    value={value}
                    onChange={(newValue) => handleInputChange('financial', 'variableCosts', newValue, key)}
                    placeholder="0"
                    style={{ borderColor: colors.border }}
                  />
                </FieldWithTooltip>
              ))}
          </div>
          
          {/* Custom Variable Costs */}
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-orange-700">Custom Variable Costs</h4>
            {(formData.financial.variableCosts.custom || []).map(cost => (
              <div key={cost.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={cost.name}
                  onChange={(e) => {
                    const updatedCustom = formData.financial.variableCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, name: e.target.value } : c
                    );
                    handleInputChange('financial', 'variableCosts', updatedCustom, 'custom');
                  }}
                  className="flex-1 p-2 border rounded text-sm"
                  placeholder="Cost name"
                />
                <CurrencyInput
                  value={cost.amount}
                  onChange={(newValue) => {
                    const updatedCustom = formData.financial.variableCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, amount: newValue } : c
                    );
                    handleInputChange('financial', 'variableCosts', updatedCustom, 'custom');
                  }}
                  placeholder="0"
                  style={{ borderColor: colors.border }}
                />
                <button
                  onClick={() => removeCustomCost('variableCosts', cost.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addCustomCost('variableCosts')}
              className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Variable Cost</span>
            </button>
          </div>
        </div>

        {/* Products and Services */}
        <div className="bg-teal-50 rounded-xl p-4">
          <h3 className="font-bold text-teal-800 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Products & Services (Revenue Sources)
          </h3>
          
          {formData.financial.productsServices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No products or services added yet</p>
            </div>
          )}
          
          {formData.financial.productsServices.map((product, index) => (
            <div key={product.id} className="mb-4 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-teal-700">Product/Service #{index + 1}</h4>
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      financial: {
                        ...prev.financial,
                        productsServices: prev.financial.productsServices.filter(p => p.id !== product.id)
                      }
                    }));
                  }}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => {
                    const updated = formData.financial.productsServices.map(p =>
                      p.id === product.id ? { ...p, name: e.target.value } : p
                    );
                    handleInputChange('financial', 'productsServices', updated);
                  }}
                  className="p-2 border rounded text-sm"
                  placeholder="Product/Service name"
                />
                
                <input
                  type="text"
                  value={product.description}
                  onChange={(e) => {
                    const updated = formData.financial.productsServices.map(p =>
                      p.id === product.id ? { ...p, description: e.target.value } : p
                    );
                    handleInputChange('financial', 'productsServices', updated);
                  }}
                  className="p-2 border rounded text-sm"
                  placeholder="Brief description"
                />
                
                <div>
                  <label className="text-xs text-gray-600">Selling Price</label>
                  <CurrencyInput
                    value={product.price}
                    onChange={(newValue) => {
                      const updated = formData.financial.productsServices.map(p =>
                        p.id === product.id ? { ...p, price: newValue } : p
                      );
                      handleInputChange('financial', 'productsServices', updated);
                    }}
                    placeholder="0"
                    style={{ borderColor: colors.border }}
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600">Cost to Make/Buy</label>
                  <CurrencyInput
                    value={product.costOfGoods}
                    onChange={(newValue) => {
                      const updated = formData.financial.productsServices.map(p =>
                        p.id === product.id ? { ...p, costOfGoods: newValue } : p
                      );
                      handleInputChange('financial', 'productsServices', updated);
                    }}
                    placeholder="0"
                    style={{ borderColor: colors.border }}
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-600">Monthly Quantity Sold</label>
                  <input
                    type="number"
                    value={product.monthlyQuantity}
                    onChange={(e) => {
                      const updated = formData.financial.productsServices.map(p =>
                        p.id === product.id ? { ...p, monthlyQuantity: parseFloat(e.target.value) || 0 } : p
                      );
                      handleInputChange('financial', 'productsServices', updated);
                    }}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="flex items-end">
                  <div className="text-sm">
                    <span className="text-gray-600">Profit Margin: </span>
                    <span className="font-bold" style={{
                      color: (product.price - product.costOfGoods) > 0 ? colors.success : colors.error
                    }}>
                      {product.price > 0 ? Math.round(((product.price - product.costOfGoods) / product.price) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={addProductService}
            className="w-full py-3 border-2 border-dashed border-teal-300 rounded-lg text-teal-600 hover:bg-teal-50 font-medium flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product or Service</span>
          </button>
        </div>

        {/* Financial Health Dashboard */}
        <div className="bg-indigo-50 rounded-xl p-4">
          <h3 className="font-bold text-indigo-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Financial Health Dashboard
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Break-Even Analysis</h4>
              {breakEvenMonth > 0 && breakEvenMonth <= 36 ? (
                <div>
                  <div className="text-2xl font-bold" style={{ color: colors.success }}>
                    Month {breakEvenMonth}
                  </div>
                  <p className="text-xs text-gray-500">Until profitability</p>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold" style={{ color: colors.error }}>
                    Not Yet
                  </div>
                  <p className="text-xs text-gray-500">Add revenue sources</p>
                </div>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Month 1 Cash Flow</h4>
              <div className="text-2xl font-bold" style={{
                color: projections[0]?.profit >= 0 ? colors.success : colors.error
              }}>
                {formatCurrencyString(projections[0]?.profit || 0)}
              </div>
              <p className="text-xs text-gray-500">
                Revenue - All Expenses
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Year 1 Revenue</h4>
              <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                {formatCurrencyString(
                  projections.slice(0, 12).reduce((sum, month) => sum + month.projectedRevenue, 0)
                )}
              </div>
              <p className="text-xs text-gray-500">Total projected</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Funding Gap</h4>
              <div className="text-2xl font-bold" style={{
                color: totalStartupCosts <= formData.financial.bootstrapBudget ? colors.success : colors.warning
              }}>
                {totalStartupCosts <= formData.financial.bootstrapBudget ?
                  'Fully Funded!' :
                  formatCurrencyString(totalStartupCosts - formData.financial.bootstrapBudget)
                }
              </div>
              <p className="text-xs text-gray-500">
                {totalStartupCosts <= formData.financial.bootstrapBudget ?
                  'Ready to launch' :
                  'Additional funding needed'
                }
              </p>
            </div>
          </div>
        </div>

        {/* 36-Month Projections Preview */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            36-Month Financial Projections
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Month</th>
                  <th className="text-right py-2 px-3">Revenue</th>
                  <th className="text-right py-2 px-3">Expenses</th>
                  <th className="text-right py-2 px-3">Profit</th>
                </tr>
              </thead>
              <tbody>
                {projections.slice(0, 6).map((month, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-3">Month {index + 1}</td>
                    <td className="text-right py-2 px-3">{formatCurrencyString(month.projectedRevenue)}</td>
                    <td className="text-right py-2 px-3">{formatCurrencyString(month.projectedExpenses)}</td>
                    <td className="text-right py-2 px-3 font-medium" style={{
                      color: month.profit >= 0 ? colors.success : colors.error
                    }}>
                      {formatCurrencyString(month.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Showing first 6 months of 36
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};