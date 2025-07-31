import React from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import { colors } from '../../config/constants';
import { ThreeFishHeader } from '../shared/Navigation';
import { FieldWithTooltip, CurrencyInput, NumberInput, formatCurrencyString, ChallengeQuestions } from '../shared/FormComponents';

const FinancialPlanning = ({ formData, handleInputChange, challengeQuestions }) => {
  // Add custom cost line item
  const addCustomCost = (costType) => {
    const newItem = {
      id: Date.now(),
      name: '',
      amount: 0,
      description: '',
      tooltip: ''
    };
    
    const currentCustom = formData[costType]?.custom || [];
    handleInputChange(costType, [...currentCustom, newItem], 'custom');
  };

  // Remove custom cost line item
  const removeCustomCost = (costType, itemId) => {
    const currentCustom = formData[costType]?.custom || [];
    const newCustom = currentCustom.filter(item => item.id !== itemId);
    handleInputChange(costType, newCustom, 'custom');
  };

  // Add product/service
  const addProductService = () => {
    const newProduct = {
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      costOfGoods: 0,
      monthlyQuantity: 0,
      seasonalVariation: 0
    };
    
    const currentProducts = formData.productsServices || [];
    handleInputChange('productsServices', [...currentProducts, newProduct]);
  };

  // Remove product/service
  const removeProductService = (productId) => {
    const currentProducts = formData.productsServices || [];
    const newProducts = currentProducts.filter(product => product.id !== productId);
    handleInputChange('productsServices', newProducts);
  };

  // Update product/service
  const updateProductService = (index, field, value) => {
    const currentProducts = formData.productsServices || [];
    const newProducts = [...currentProducts];
    newProducts[index] = { ...newProducts[index], [field]: value };
    handleInputChange('productsServices', newProducts);
  };

  // Calculate monthly projections with growth and inflation
  const calculateProjections = () => {
    // Calculate base monthly revenue from all products/services
    const baseRevenue = (formData.productsServices || []).reduce((sum, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.monthlyQuantity) || 0;
      return sum + (price * quantity);
    }, 0);
    
    // Calculate total fixed costs
    const standardFixedCosts = Object.entries(formData.fixedCosts || {})
      .filter(([key]) => key !== 'custom')
      .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
    
    const customFixedCosts = (formData.fixedCosts?.custom || [])
      .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
    
    const totalFixedCosts = standardFixedCosts + customFixedCosts;
    
    // Calculate total variable costs
    const standardVariableCosts = Object.entries(formData.variableCosts || {})
      .filter(([key]) => key !== 'custom')
      .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
    
    const customVariableCosts = (formData.variableCosts?.custom || [])
      .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
    
    const totalVariableCosts = standardVariableCosts + customVariableCosts;
    
    // Calculate cost of goods sold (COGS) from products/services
    const baseCOGS = (formData.productsServices || []).reduce((sum, product) => {
      const costOfGoods = parseFloat(product.costOfGoods) || 0;
      const quantity = parseInt(product.monthlyQuantity) || 0;
      return sum + (costOfGoods * quantity);
    }, 0);
    
    return Array(12).fill(null).map((_, index) => {
      // Growth factor compounds monthly
      const growthFactor = Math.pow(1 + ((parseFloat(formData.salesGrowthRate) || 0) / 100 / 12), index);
      // Inflation factor compounds monthly
      const inflationFactor = Math.pow(1 + ((parseFloat(formData.inflationRate) || 0) / 100 / 12), index);
      
      // Revenue grows with growth factor
      const projectedRevenue = baseRevenue * growthFactor;
      
      // Fixed costs only increase with inflation
      const inflatedFixedCosts = totalFixedCosts * inflationFactor;
      
      // Variable costs grow with sales volume (growth factor) and inflation
      const scaledVariableCosts = totalVariableCosts * growthFactor * inflationFactor;
      
      // COGS scales with sales volume
      const scaledCOGS = baseCOGS * growthFactor;
      
      // Total projected expenses
      const projectedExpenses = inflatedFixedCosts + scaledVariableCosts + scaledCOGS;
      
      return {
        month: index + 1,
        projectedRevenue: Math.round(projectedRevenue * 100) / 100,
        projectedExpenses: Math.round(projectedExpenses * 100) / 100,
        profit: Math.round((projectedRevenue - projectedExpenses) * 100) / 100
      };
    });
  };

  return (
    <div className="space-y-8">
      <ThreeFishHeader fishApproach="giveFish" />
      <ChallengeQuestions challengeQuestions={challengeQuestions} />

      {/* Financial Overview Header */}
      <div className="bg-green-50 rounded-xl p-6 border-l-4" style={{ borderColor: colors.secondary }}>
        <div className="flex items-center space-x-3 mb-3">
          <Calculator className="w-6 h-6" style={{ color: colors.secondary }} />
          <h3 className="font-bold text-xl" style={{ color: colors.secondary }}>
            💰 Bootstrap Budget Planning
          </h3>
        </div>
        <p className="text-sm mb-2" style={{ color: colors.text }}>
          Plan your finances with faith and wisdom. Start lean, prove it works, then grow.
        </p>
        <p className="text-xs text-gray-600">
          "Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost?" - Luke 14:28
        </p>
      </div>

      {/* Bootstrap Budget Settings */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-bold mb-4 flex items-center" style={{ color: colors.primary }}>
          ⚙️ Planning Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldWithTooltip fieldKey="bootstrapBudget" label="Bootstrap Budget" required>
            <CurrencyInput
              value={formData.bootstrapBudget || 5000}
              onChange={(value) => handleInputChange('bootstrapBudget', value)}
              placeholder="5000"
            />
            <p className="text-xs text-gray-600 mt-1">How much can you spend without borrowing?</p>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="salesGrowthRate" label="Monthly Sales Growth %">
            <NumberInput
              value={formData.salesGrowthRate || 10}
              onChange={(value) => handleInputChange('salesGrowthRate', value)}
              placeholder="10"
              min="0"
              max="50"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="inflationRate" label="Annual Inflation Rate %">
            <NumberInput
              value={formData.inflationRate || 3.5}
              onChange={(value) => handleInputChange('inflationRate', value)}
              placeholder="3.5"
              min="0"
              max="20"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="planningPeriod" label="Planning Period (Months)">
            <NumberInput
              value={formData.planningPeriod || 36}
              onChange={(value) => handleInputChange('planningPeriod', value)}
              placeholder="36"
              min="12"
              max="60"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Startup Costs Section */}
      <div className="bg-white rounded-xl p-6 border" style={{ borderColor: colors.border }}>
        <h4 className="font-bold mb-4 flex items-center" style={{ color: colors.text }}>
          🏗️ One-Time Startup Costs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries({
            equipment: "Equipment & Tools",
            initialInventory: "Initial Inventory",
            deposits: "Deposits & Fees",
            licenses: "Licenses & Permits",
            initialMarketing: "Grand Opening Marketing",
            workingCapital: "Working Capital Buffer",
            furniture: "Furniture & Fixtures",
            technology: "Technology & Software",
            renovation: "Space Renovation",
            legal: "Legal & Professional Fees"
          }).map(([key, label]) => (
            <FieldWithTooltip key={key} fieldKey={key} label={label}>
              <CurrencyInput
                value={(formData.startupCosts && formData.startupCosts[key]) || 0}
                onChange={(value) => handleInputChange('startupCosts', value, key)}
                placeholder="0"
              />
            </FieldWithTooltip>
          ))}
        </div>

        {/* Startup Costs Total */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-bold">Total Startup Investment:</span>
            <span className="text-xl font-bold" style={{ color: colors.primary }}>
              {formatCurrencyString(Object.values(formData.startupCosts || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0))}
            </span>
          </div>
          {Object.values(formData.startupCosts || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0) > (formData.bootstrapBudget || 0) && (
            <div className="mt-2 text-sm text-red-700 font-medium">
              ⚠️ Over budget by {formatCurrencyString(Object.values(formData.startupCosts || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0) - (formData.bootstrapBudget || 0))}
            </div>
          )}
        </div>
      </div>

      {/* Products & Services Revenue */}
      <div className="bg-white rounded-xl p-6 border" style={{ borderColor: colors.border }}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold flex items-center" style={{ color: colors.text }}>
            💰 Products & Services Revenue
          </h4>
          <button
            onClick={addProductService}
            className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product/Service</span>
          </button>
        </div>

        {(!formData.productsServices || formData.productsServices.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-3">📦</div>
            <p>Add your first product or service to calculate revenue projections</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.productsServices.map((product, index) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Product/Service Name</label>
                    <input
                      type="text"
                      value={product.name || ''}
                      onChange={(e) => updateProductService(index, 'name', e.target.value)}
                      className="w-full p-2 border rounded text-sm"
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={product.price || 0}
                      onChange={(e) => updateProductService(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border rounded text-sm"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Cost of Goods ($)</label>
                    <input
                      type="number"
                      value={product.costOfGoods || 0}
                      onChange={(e) => updateProductService(index, 'costOfGoods', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border rounded text-sm"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Quantity</label>
                    <input
                      type="number"
                      value={product.monthlyQuantity || 0}
                      onChange={(e) => updateProductService(index, 'monthlyQuantity', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded text-sm"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removeProductService(product.id)}
                      className="w-full p-2 text-red-500 hover:bg-red-50 rounded text-sm"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Monthly Revenue: {formatCurrencyString((product.price || 0) * (product.monthlyQuantity || 0))} | 
                  Monthly Profit: {formatCurrencyString(((product.price || 0) - (product.costOfGoods || 0)) * (product.monthlyQuantity || 0))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Revenue Summary */}
        {formData.productsServices && formData.productsServices.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Monthly Revenue (Starting):</span>
              <span className="text-xl font-bold" style={{ color: colors.success }}>
                {formatCurrencyString(
                  formData.productsServices.reduce((sum, product) => {
                    const price = parseFloat(product.price) || 0;
                    const quantity = parseInt(product.monthlyQuantity) || 0;
                    return sum + (price * quantity);
                  }, 0)
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Financial Projections Chart */}
      {formData.productsServices && formData.productsServices.length > 0 && (
        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: colors.border }}>
          <h4 className="font-bold mb-4 flex items-center" style={{ color: colors.text }}>
            📊 12-Month Financial Projections
          </h4>
          
          {/* Simple projection table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">Expenses</th>
                  <th className="text-right p-2">Profit</th>
                  <th className="text-right p-2">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {calculateProjections().map((month, index) => {
                  const cumulative = calculateProjections().slice(0, index + 1)
                    .reduce((sum, m) => sum + m.profit, 0);
                  return (
                    <tr key={month.month} className="border-b">
                      <td className="p-2">Month {month.month}</td>
                      <td className="text-right p-2 text-green-600">
                        {formatCurrencyString(month.projectedRevenue)}
                      </td>
                      <td className="text-right p-2 text-red-600">
                        {formatCurrencyString(month.projectedExpenses)}
                      </td>
                      <td className={`text-right p-2 ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrencyString(month.profit)}
                      </td>
                      <td className={`text-right p-2 font-medium ${cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrencyString(cumulative)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Wisdom */}
      <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
        <h4 className="font-bold text-yellow-800 mb-3">💡 Financial Wisdom</h4>
        <div className="space-y-2 text-sm text-yellow-700">
          <div>• Start with minimum viable budget - you can always expand later</div>
          <div>• Keep 6 months of expenses in reserve for unexpected challenges</div>
          <div>• Test your pricing with real customers before committing to inventory</div>
          <div>• Track every expense from day one - small leaks sink big ships</div>
          <div>• Plan for taxes - set aside 25-30% of profits quarterly</div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanning;