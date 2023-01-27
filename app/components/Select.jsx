export default function Select({ name, id, options, fieldError }) {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    return (
        <>
            <select
                name={name}
                id={id}
                defaultValue={name === 'month' ? currentMonth : ''}
                className="py-1 px-3 bg-[#f8f8ff] border border-[#c0c0c0] rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
                {options.map((option, index) => (
                    <option
                        value={option}
                        key={index}
                    >
                        {option}
                    </option>
                ))}
            </select>
            {fieldError
                ? (<span className="pt-1 text-red-700 inline text-sm" id="email-error">{fieldError}</span>)
                : <>&nbsp;</>
            }
        </>
    );
}