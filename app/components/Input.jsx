import { useActionData } from "@remix-run/react";
import { forwardRef, useRef, useState, useEffect } from "react";

// TODO: Focus management
const Input = forwardRef(({ type, name, id, placeholder, fieldError, onBlur }, ref) => {
    // const actionData = useActionData();
    const [isClientError, setIsClientError] = useState(true);
    const errorState = isClientError && fieldError;
    // const inputRef = useRef(null);

    function handleChange() {
        setIsClientError(false);
    }

    // useEffect(() => {
    //     if (fieldError) {
    //     }
    //     inputRef.current?.focus()
    // }, []);
    // TODO: Always display error messages upon multiple submissions. Use a clean up function maybe
    return (
        <>

            <input
                ref={ref}
                type={type}
                name={name}
                id={id}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={onBlur}
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
