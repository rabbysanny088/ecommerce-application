import React from "react";

const Input = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  Icon,
  required = false,
  className,
  name,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className={`${className} block w-full px-3 py-2 ${
            Icon ? "pl-10" : ""
          } bg-gray-700 border border-gray-600 rounded-md shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
          focus:border-emerald-500 sm:text-sm`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
