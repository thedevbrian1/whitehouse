import { Link } from "@remix-run/react";

export default function TermsAndConditions() {
    return (
        <main>
            <div className="w-4/5 lg:max-w-5xl mx-auto py-28 space-y-5 text-light-black lg:px-5">
                {/* <Link>
                </Link> */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="w-14 h-14">
                        <img src="/W.svg" alt="W" className="w-full h-full" />
                    </div>
                    <h1 className="font-bold text-3xl lg:text-4xl text-center">White House Court</h1>

                </div>
                <p>
                    The Whitehouse court has been created to provide a comfortable and secure living environment and
                    lifestyle for the residents of the Court. The intention of these rules is that of protecting and enhancing
                    this lifestyle in the Court environment. These rules are binding upon all owners, residents, visitors, and
                    contractors, as are decisions taken by the residents in interpreting or enforcing these rules. The
                    registered owners of properties are responsible for ensuring that members of their families, tenants,
                    visitors, friends, add all their employees are aware of, and abide by these rules. The Residents of
                    Whitehouse court reserve the right to modify, amend, add to, or delete any of these rules from time to
                    time.
                </p>

                <p>
                    The rules and structures in this document have therefore been agreed to and implemented to manage
                    this environment and to exercise certain objectives including but not limited to construction procedures,
                    access control, and general on-site security. However, the rules/bylaws/legislation of all the relevant
                    City of Nairobi County regulatory authorities are unequivocally applicable and enforceable within the
                    court.
                </p>

                <p>
                    An important element of a secure lifestyle is that of prevention and deterrence. Residents are requested
                    to familiarize themselves with the procedures which have been developed to manage the influx of
                    people and vehicles with the minimum disruption whilst at the same time protecting the residents. From
                    time to time changes may be made to some of these procedures and residents will be advised
                    accordingly. Residents are reminded that they are fully responsible and accountable for the conduct of
                    their visitors and for ensuring that they adhere to all the security procedures and requirements.
                </p>

                <section>
                    <h2 className="font-semibold text-gray-800 text-xl lg:text-2xl">Rules and regulations within the court</h2>
                    <ol className="list-decimal px-5 mt-3">
                        <li>
                            All visitors shall be required to identify themselves and their hosts and register at the main gate.
                        </li>
                        <li>
                            The speed limit is 5 km/h.
                        </li>
                        <li>
                            The use of motorcycles(Boda Boda) after 7 PM within the court is prohibited.
                        </li>
                        <li>
                            All resident vehicles must have a court sticker. Vehicles not bearing a sticker shall not be allowed into the court unless picking up or dropping, and only be allowed to do so after registering at the gate. They shall be subjected to a security check.
                        </li>
                        <li>
                            Hooting at the entrance/exit and within the court and the use of noisy exhaust systems anywhere within the court is strictly prohibited.
                        </li>
                        <li>
                            No resident shall be a nuisance to others, e.g by playing loud music, being disorderly, or causing any other kind of noise.
                        </li>
                        <li>
                            No resident, resident's agent and/or contractor is allowed to dispose off any garbage, rubble, and/or excess of any kind on any private and/or common property.
                        </li>
                        <li>
                            No househelp shall be allowed to move out without a release from their employer.
                        </li>
                        <li>
                            All tenants/residents shall contribute a mandatory monthly fee of Ksh 200 (subject to review upon consultation by residents) on or before every 5<sup>th</sup> date of every month. Defaulters shall not be allowed to move out of the court until they clear their arrears; any other course of action may be taken.
                        </li>
                        <li>
                            All relevant rules/bylaws/legislation of all the relevant authorities with regard to road usage by vehicles and pedestrians are applicable within the court exactly as they are applicable on the public roads. These include but are not limited to road traffic signage, licensed vehicles and drivers, reckless driving and illegal parking e.g parking infront of other tenants's gated and obstructing other parked vehicles. This is subject to the management to determine other special conditions within the court.
                        </li>
                    </ol>
                </section>
                <section>
                    <h2 className="font-semibold text-gray-800 text-xl lg:text-2xl">Enforcement of rules and instructions</h2>
                    <p className="mt-3">
                        All home owners, visitors, service providers, agents, workers, delivery personnel, and/or other persons entering the court are obligated to comply with all the rules described in this document and to fully co-operate with the management and security in their effort to enforce security. As it's impossible for security to educate every entrant in the court, the onus is on the resident to inform their visitors, contractors, sub-contractors, service providers, agents, workers, delivery personnel and/or any other persons entering the court of the court rules.
                    </p>
                    <div className="mt-3">
                        <p>Thank you</p>
                        <p>Security committee</p>
                        <div className="space-x-4">
                            <span>Signed:</span>
                            <span>Chairman</span>
                        </div>
                        <p className="mt-3"><b>CC: All tenants, residents, property owners, landlords, caretakers, chief, area OCPD and OCS.</b></p>
                    </div>
                </section>
            </div>
        </main>
    )
}