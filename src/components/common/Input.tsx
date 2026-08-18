import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, startIcon, endIcon, id, className = '', ...rest }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`gov-input-group ${error ? 'has-error' : ''} ${className}`.trim()}>
        {label && (
          <label htmlFor={inputId} className="gov-input-label">
            {label}
            {rest.required && <span className="gov-required-star" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="gov-input-wrapper">
          {startIcon && <span className="gov-input-icon-start">{startIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`gov-input-field ${startIcon ? 'has-start-icon' : ''} ${endIcon ? 'has-end-icon' : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...rest}
          />
          {endIcon && <span className="gov-input-icon-end">{endIcon}</span>}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="gov-input-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="gov-input-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, error, id, className = '', ...rest }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`gov-input-group ${error ? 'has-error' : ''} ${className}`.trim()}>
        {label && (
          <label htmlFor={selectId} className="gov-input-label">
            {label}
            {rest.required && <span className="gov-required-star" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="gov-select-wrapper">
          <select
            ref={ref}
            id={selectId}
            className="gov-select-field"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            {...rest}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="gov-select-arrow" aria-hidden="true">
            ▾
          </span>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="gov-input-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="gov-input-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
