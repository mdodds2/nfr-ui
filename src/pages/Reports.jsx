import { Link, useLoaderData } from 'react-router-dom';
import { getUserData } from '../util/auth.js';
import { getReportsForUser } from '../util/http.js';

import LayoutGrid from '../ui/LayoutGrid.jsx';
import LayoutList from '../ui/LayoutList.jsx';

import ReportImage from '../assets/report.png';

import Tile from '../ui/Tile.jsx';
import { useState } from 'react';

function formatDate(sqlDate) {
    const t = sqlDate.split(/[-T :]/);
    return(`${t[0]}-${t[1]}-${t[2]}`);
}

export default function ReportsPage() {

    const reports = useLoaderData();
    const [currentView, setCurrentView] = useState('grid');

    return (
        <main>

            <section>
                <div className="header-row">
                    <h1>My Reports</h1>
                    <div className="icon-group">
                        <span onClick={() => setCurrentView('grid')}><LayoutGrid /></span> <span onClick={() => setCurrentView('list')}><LayoutList /></span>
                    </div>
                </div>

                {reports.length === 0 && <div>
                    <br/>
                    <p>No reports found</p>
                </div>}

                { currentView == 'grid' && <div className="tile-container">
                    { reports && reports.map( (report) => 
                        <Tile key={report.id} id={report.id} title={report.name} image={ReportImage} caption={`Created ${formatDate(report.createdAt)}`} alt="Report Logo" />
                    )}
                </div> }

                { currentView == 'list' && <ul className="list-view">
                    { reports && reports.map( (report) => 
                        <li className="list-item">
                            <img src={ReportImage} alt="icon" class="item-icon" />
                            <div class="item-content">
                                <h3 class="item-title">{report.name}</h3>
                                <p class="item-description">{report.description}, created {report.createdAt}</p>
                                <Link target="_new" className="link-button link-button-small" to={`/reports/display/${report.id}`}>View</Link>
                                <Link className="link-button link-button-small" to={`/reports/edit/${report.id}`}>Update</Link>
                            </div>
                        </li>
                    )}
                </ul> }

                <article>
                    <a href="/reports/new" className="link-button link-button-25">New Report</a>
                </article>


            </section>
        </main>
    );
}

export async function loader({ request, params }) {
    const reports = await getReportsForUser(getUserData().id);
    return reports;
}