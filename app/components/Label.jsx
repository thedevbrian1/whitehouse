export default function Label({ htmlFor, text }) {
    return (
        <label htmlFor={htmlFor} className="uppercase text-gray-600 text-sm pb-2">{text}</label>
    )
}