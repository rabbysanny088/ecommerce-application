const CreateInput = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  Icon,
  required = false,
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
          placeholder={placeholder}
          className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
                       px-3 text-white focus:outline-none focus:ring-2
                      focus:ring-emerald-500 focus:border-emerald-500`}
          {...props}
        />
      </div>
    </div>
  );
};

export default CreateInput;
