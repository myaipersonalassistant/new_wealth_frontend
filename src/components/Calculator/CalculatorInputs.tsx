import React from 'react';

export interface CalculatorInputValues {
  propertyPrice: number;
  depositAmount: number;
  depositPercent: number;
  interestRate: number;
  mortgageTerm: number;
  monthlyRent: number;
  monthlyExpenses: number;
  annualAppreciation: number;
  annualRentIncrease: number;
}

interface CalculatorInputsProps {
  values: CalculatorInputValues;
  onChange: (values: CalculatorInputValues) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
};

const InputSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  description?: string;
}> = ({ label, value, min, max, step, onChange, format, suffix, prefix, icon, description }) => {
  const displayValue = format ? format(value) : `${prefix || ''}${value.toLocaleString()}${suffix || ''}`;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            {icon}
          </div>
          <div>
            <label className="text-white font-medium text-sm">{label}</label>
            {description && <p className="text-slate-500 text-xs">{description}</p>}
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 min-w-[120px] text-right">
          <span className="text-amber-400 font-semibold text-sm">{displayValue}</span>
        </div>
      </div>
      <div className="relative h-2 mt-3 mb-1">
        <div className="absolute inset-0 bg-slate-700 rounded-full" />
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg shadow-black/30 border-2 border-amber-500 transition-all duration-150 pointer-events-none"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>{format ? format(min) : `${prefix || ''}${min.toLocaleString()}${suffix || ''}`}</span>
        <span>{format ? format(max) : `${prefix || ''}${max.toLocaleString()}${suffix || ''}`}</span>
      </div>
    </div>
  );
};

const CalculatorInputs: React.FC<CalculatorInputsProps> = ({ values, onChange }) => {
  const updateValue = (key: keyof CalculatorInputValues, value: number) => {
    const newValues = { ...values, [key]: value };

    // Sync deposit amount and percent
    if (key === 'depositPercent') {
      newValues.depositAmount = Math.round(newValues.propertyPrice * (value / 100));
    } else if (key === 'depositAmount') {
      newValues.depositPercent = Math.round((value / newValues.propertyPrice) * 100);
    } else if (key === 'propertyPrice') {
      newValues.depositAmount = Math.round(value * (newValues.depositPercent / 100));
    }

    onChange(newValues);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Property Details
        </h3>
        <p className="text-slate-400 text-sm mt-1">Adjust the sliders to model your investment</p>
      </div>

      {/* Property Price */}
      <InputSlider
        label="Property Price"
        value={values.propertyPrice}
        min={50000}
        max={2000000}
        step={5000}
        onChange={(v) => updateValue('propertyPrice', v)}
        format={formatCurrency}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        }
      />

      {/* Deposit */}
      <InputSlider
        label="Deposit"
        value={values.depositPercent}
        min={5}
        max={50}
        step={1}
        onChange={(v) => updateValue('depositPercent', v)}
        suffix="%"
        description={`${formatCurrency(values.depositAmount)} deposit`}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />

      {/* Interest Rate */}
      <InputSlider
        label="Interest Rate"
        value={values.interestRate}
        min={1}
        max={10}
        step={0.1}
        onChange={(v) => updateValue('interestRate', v)}
        suffix="%"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />

      {/* Mortgage Term */}
      <InputSlider
        label="Mortgage Term"
        value={values.mortgageTerm}
        min={5}
        max={35}
        step={1}
        onChange={(v) => updateValue('mortgageTerm', v)}
        suffix=" years"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Monthly Rent */}
      <InputSlider
        label="Monthly Rental Income"
        value={values.monthlyRent}
        min={0}
        max={10000}
        step={50}
        onChange={(v) => updateValue('monthlyRent', v)}
        format={formatCurrency}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Monthly Expenses */}
      <InputSlider
        label="Monthly Expenses"
        value={values.monthlyExpenses}
        min={0}
        max={3000}
        step={25}
        onChange={(v) => updateValue('monthlyExpenses', v)}
        format={formatCurrency}
        description="Insurance, maintenance, management, etc."
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        }
      />

      {/* Advanced: Appreciation Rate */}
      <InputSlider
        label="Annual Property Appreciation"
        value={values.annualAppreciation}
        min={0}
        max={10}
        step={0.5}
        onChange={(v) => updateValue('annualAppreciation', v)}
        suffix="%"
        description="Historical UK average: ~3.5%"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        }
      />

      {/* Annual Rent Increase */}
      <InputSlider
        label="Annual Rent Increase"
        value={values.annualRentIncrease}
        min={0}
        max={8}
        step={0.5}
        onChange={(v) => updateValue('annualRentIncrease', v)}
        suffix="%"
        description="Typical range: 2-4%"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        }
      />
    </div>
  );
};

export default CalculatorInputs;
