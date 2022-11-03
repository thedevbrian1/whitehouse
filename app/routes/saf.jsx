export async function loader({ request }) {
    // console.log({ request: request.body })
    const res = await fetch('https://brianmwangi.co.ke/whitehouse');
    console.log({ res: res.body });
    return null;
}

// export default function Saf() {
//     return (
//         <div>

//         </div>
//     )
// }