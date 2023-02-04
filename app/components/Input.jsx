import { useTransition } from "@remix-run/react";
import { forwardRef, useState, useEffect } from "react";

const Input = forwardRef(({ type, name, id, placeholder, fieldError, onBlur, defaultValue }, ref) => {
    const [isClientError, setIsClientError] = useState(true);
    const errorState = isClientError && fieldError;

    const transition = useTransition();

    function handleChange() {
        setIsClientError(false);
    }

    useEffect(() => {
        if (transition.state === 'submitting') {
            setIsClientError(true);
        }
    }, [transition.submission]);

    // FIXME: Fix flashing of error state when submitting
    return (
        <>

            <input
                ref={ref}
                type={type}
                name={name}
                id={id}
                placeholder={placeholder}
                onChange={handleChange}
                defaultValue={defaultValue}
                onBlur={(event => onBlur(event))}
                className={`block w-full px-3 py-2 border  rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorState ? 'border-red-700' : 'border-gray-400'}`}
            />
            {
                errorState
                    ? (<span className="pt-1 text-red-700 inline text-sm" id="email-error">
                        {fieldError}
                    </span>)
                    : <>&nbsp;</>
            }
        </>

    );
})

export default Input;
