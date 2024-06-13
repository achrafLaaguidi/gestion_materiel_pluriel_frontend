const InputField = ({ id, label, type, value, onChange, required = false, placeholder }) => (
    <div className="mb-3 w-100 ">
        <label htmlFor={id} className="form-label font-weight-bold">{label}</label>
        <input
            type={type}
            className="form-control"
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
        />
    </div>
);

const RadioField = ({ label, name, options, selectedValue, onChange }) => (
    <div className="mb-3">
        <span className="font-weight-bold">{label}:</span>
        <div className="custom-radio m-3 p-1 row justify-content-between">
            {options.map(option => (
                <div className="form-check" key={option.value}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name={name}
                        id={option.value}
                        value={option.value}
                        checked={selectedValue === option.value}
                        onChange={onChange}
                    />
                    <label className="form-check-label" htmlFor={option.value}>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    </div>
);

export { InputField, RadioField }