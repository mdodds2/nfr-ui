import { getUserData } from "../../util/auth.js";

export default function Organizations( {orgs = []}) {
    return (
        <article>
            <div>
            { getUserData().role === 'ADMIN' && <h2>All Organizations</h2> }
            { getUserData().role !== 'ADMIN' && <h2>Your Organizations</h2> }
            { orgs.length > 0 && <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Slug</th>
                    </tr>
                </thead>

                <tbody>
                    { orgs.map((org) =>
                        <tr key={org.id}>
                            <td>{org.id}</td>
                            <td>{org.name}</td>
                            <td>{org.slug}</td>
                        </tr>
                    )}
                </tbody>
            </table> }
            </div>
        </article>
    );
}