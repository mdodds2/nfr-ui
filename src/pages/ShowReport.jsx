import { useLoaderData } from "react-router-dom";
import { getCategories, getReport, getUser } from "../util/http.js";
import { useEffect, useState } from "react";
import TwoColumnRow from "../ui/TwoColumnRow.jsx";

export default function ShowReport() {
    const { report, categories, user } = useLoaderData();

    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll("h2, h3, h4"))
            .map((elem) => ({
                text: elem.innerText,
            }))
        setHeadings(elements);
    }, []);

    return (
        <main className="report">
            <section>
                <h1>Quality Attributes Report:  {report && report.name}</h1>

                <article>
                    <p>This template was created to enable departments to more easily develop their project plans.  The Department of Technology, Consulting and Planning Division, created this template based on its experiences. The template relies on industry best practices combined with decades of experience on California state information technology projects.  The way it was structured is to enable a department to complete the information related to its project without having to write background information related to the discipline. A department may use as much or as little of the template as it wishes. </p>
                </article>
                <article>
                    <b>Template Instructions:</b>
                    <ul>
                        <li>Instructions for completing this template - written for the author of the project plan - are encased in [ ] and the text is italicized and bolded.</li>
                        <li>Examples are provided as a guideline to the type of sample information presented in each section and the text is italicized.</li>
                        <li>Boilerplate standard language for each section is written in the document font and may be used or modified, as necessary.</li>
                        <li>A department's project specific information goes within the brackets &lt;&lt;    &gt;&gt;.</li>
                        <li>Informational text is italicized within square brackets [ ] for informational purposes to the person who has to create the plan and includes background information, explanation, rationale, etc.</li>
                    </ul>
                </article>

                <article>
                    <p className="heading">Document History</p>
                    <table>
                        <thead>
                            <tr>
                                <th className="reportHeader" colSpan="4">DOCUMENT REVISION HISTORY</th>
                            </tr>
                            <tr>
                                <th>DATE</th>
                                <th>DOCUMENT VERSION</th>
                                <th>REVISION DESCRIPTION</th>
                                <th>AUTHOR</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{report && report.createdAt}</td>
                                <td>1.0</td>
                                <td>{report && report.description}</td>
                                <td>{user.name}</td>
                            </tr>
                        </tbody>
                    </table>
                </article>

                <article>
                    <p className="heading">Table of Contents</p>
                    <br />
                    <nav>
                        <ul>
                            {headings.map((heading, index) => (
                                <li key={heading.text}>
                                    <a href="#">{heading.text}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </article>

                <Introduction />
                <Overview />
                <ReferencedDocuments />
                <NonFunctionalRequirements report={report} categories={categories} />

                {categories.map((category) =>
                    <Category key={category.id} report={report} category={category} />
                )}

            </section>
        </main>
    );
}

function Introduction() {
    return <article>
        <h2>Introduction</h2>
        <p>ISO/IEC 25010 defines a comprehensive model for evaluating software quality. It organizes quality into eight main characteristics, each broken down into more specific sub‑characteristics. Together, they describe how well a system performs, how reliable it is, how secure it remains, and how effectively it supports users and maintainers over its lifetime.</p>
        <p>Below is a short, high‑level description of each quality attribute:</p>

        <div className="container">
            <div className="column">
                <div className="title">1. Functional Suitability</div>
                <ul>
                    <li>How well the system provides functions that meet user needs.</li>
                    <li>Includes correctness, completeness, and appropriateness of functionality.</li>
                </ul>

                <div className="title">2. Performance Efficiency</div>
                <ul>
                    <li>How effectively the system uses resources while delivering required performance.</li>
                    <li>Covers response time, throughput, capacity, and resource usage.</li>
                </ul>

                <div className="title">3. Compatibility</div>
                <ul>
                    <li>How well the system can operate with other systems.</li>
                    <li>Includes interoperability and co‑existence in shared environments.</li>
                </ul>

                <div className="title">4. Usability</div>
                <ul>
                    <li>How easy and satisfying the system is for users to learn and operate.</li>
                    <li>Includes accessibility, user error protection, and user interface quality.</li>
                </ul>
            </div>

            <div className="column">
                <div className="title">5. Reliability</div>
                <ul>
                    <li>How consistently the system performs under specified conditions.</li>
                    <li>Includes fault tolerance, availability, recoverability, and maturity.</li>
                </ul>

                <div className="title">6. Security</div>
                <ul>
                    <li>How well the system protects data and prevents unauthorized access or misuse.</li>
                    <li>Includes confidentiality, integrity, authentication, authorization, and accountability.</li>
                </ul>

                <div className="title">7. Maintainability</div>
                <ul>
                    <li>How easy it is to modify, fix, or enhance the system.</li>
                    <li>Includes modularity, reusability, analyzability, modifiability, and testability.</li>
                </ul>

                <div className="title">8. Portability</div>
                <ul>
                    <li>How easily the system can be transferred to different environments.</li>
                    <li>Includes adaptability, installability, and replaceability.</li>
                </ul>
            </div>
        </div>
    </article>
}

function Overview() {
    return <article>
        <h2>Overview</h2>
        <p>Each quality attribute specified in this document consists of five sections: Scenario, Requirement, Constraints, Verification Method, and Notes.  For
            each non-functional requirement, all five sections must exist and each section must be consistent with the other sections as well as consistent across all
            non-functional requirements.  The purpose and content of each section is described below.
        </p>

        <p>The Scenario section “sets the stage” or defines the context for the requirement.  It identifies what is occurring within the system and external to the system,
            such as by actors within a Use Case context.  For example, performance non-functional requirement Scenarios always characterize the load that will be applied
            to a system when a requirement will be measured (external aspect) and should also identify if the system is in its normal state or potentially some degraded
            performance state, (an internal aspect, e.g., batch processing has begun, half of the virtual servers are down, etc.).  This section is where the environmental
            conditions for the system are documented, including what the system is being exposed to, specific to each non-functional requirement.
        </p>

        <p>The Requirement section is the actual non-functional requirement that will be measured when the scenario begins, (e.g., the system shall have a response time
            of 1 second).  This section is where the qualities that the system must possess are defined.
        </p>

        <p>The Constraints section identifies all constraints upon the Scenario, Requirement, or Verification Method.  A Constraint may be considered a limitation, a
            boundary, or other factor that must be considered when creating a solution that meets the identified Requirement.  An example commonly used for performance
            requirements is that network communication performance beyond the scope of the Project (e.g., the Internet) shall not be considered as part of the required
            system response time.  This type of constraint may significantly change the understanding of the Requirement by changing the boundary for where the performance
            requirement actually applies; this also has an impact on how the requirement will be verified.  This section documents all constraints applicable for the
            development and implementation of the system, where the identified constraints are specific and in the context of the specified non-functional requirement.
        </p>

        <p>The Verification Method section must identify the approach to how the requirement will be verified; there is no value to the state in specifying a requirement
            if that requirement cannot be verified. There is also a cost to the state for every requirement specified regardless of whether or not it can be
            verified.  The Verification Method does not need to be specific with respect to the tools, resources, or other lower level details.  However, it must
            identify a sound and reasonable method or approach that can be used to verify the requirement and the identified method must be consistent with and actually
            verify the specified requirement.  The Project's Test Manager/Team can provide valuable input in assisting to defining the verification method.  If a
            Verification Method cannot be identified that will actually verify the identified Requirement, this is a significant indicator that the requirement is a
            poor requirement and that a different or alternate approach to defining the stakeholders' needs should be taken to achieve the required results.  For example,
            some maintainability requirements for custom code are difficult to test or verify; an alternative approach is to add measureable and verifiable requirements
            for the development process to help ensure the resulting source code is maintainable.  This type of approach changes an unverifiable product requirement to a
            verifiable process requirement to achieve the desired result.  This Verification Method section is a quality step to validate that the other sections of the
            non-functional requirement meet the criteria for specifying a testable requirement.
        </p>

        <p>The Notes section is available to document any additional information necessary to communicate the state's needs for the specific requirement.  Defining and
            specifying requirements is all about communicating the stakeholders' needs and the better those needs can be communicated, the higher the probability that there
            will be a consistent understanding by all stakeholders, including a vendor, on what the requirement actually means and its intent.  The Notes section allows for
            further elaboration for increased communications and further understanding.
        </p>

        <p>In order to establish consistency and to aid in communications, the following table is used to document each non-functional requirement.  The “ID#” field
            is a unique number to identify one requirement from all others by simply stating its ID#.  The “Name of the Requirement” text should be edited and a brief
            descriptive name for the requirement entered.
        </p>

        <table>
            <thead>
                <tr>
                    <th>ID#</th>
                    <th>UNIQUE ID #</th>
                    <th>&quot; NAME OF THE CHOSEN QUALITY ATTRIBUTE &quot;</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colSpan="2">Scenario</td>
                    <td>
                        <ul>
                            <li>Who or what initiates the scenario</li>
                            <li>The event that initiates the scenario</li>
                            <li>The system or environmental conditions (e.g., normal operations, shutting down)</li>
                            <li>Which part of system, or whole, is involved</li>
                            <li>How is the system being stressed</li>
                        </ul>
                    </td>
                </tr>

                <tr>
                    <td colSpan="2">Requirement:</td>
                    <td>What noticeable event happens as a result of the scenario</td>
                </tr>

                <tr>
                    <td colSpan="2">Constraints:</td>
                    <td>Limitations, boundaries, other conditions that must be considered</td>
                </tr>

                <tr>
                    <td colSpan="2">Verification Method:</td>
                    <td>Describe how the Requirement can be tested and verified</td>
                </tr>

                <tr>
                    <td colSpan="2">Notes:</td>
                    <td>Additional information to help communicate the needs.</td>
                </tr>

            </tbody>
        </table>

    </article>
}

function ReferencedDocuments() {
    return <article>
        <h2>Referenced Documents</h2>
        <p>The following documents were referenced and used in creating this deliverable; they also provide definitions and descriptions of non-functional
            requirements that are used in this document.
        </p>
        <ul>
            <li>ISO/IEC 25010:2023(E) Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models </li>
            <li>ISO/IEC/IEEE 24765:2010(E) Systems and software engineering – Vocabulary </li>
            <li>IEEE “Guide to the Software Engineering Body of Knowledge® (SWEBOK®) Version 3.0”, January 17, 2014</li>
            <li>IIBA “A Guide to the Business Analysis Body of Knowledge® (BABOK® Guide) Version 2.0”, March 31, 2009</li>
            <li>SEI Technical Report CMU/SEI-95-TR-021, “Quality Attributes”, December 1995</li>
            <li>“Understanding Quality Attributes in Software Architecture, 3rd Edition”, Len Bass, Paul Clements, Rick Kazman, Sep 25, 2012</li>
        </ul>

    </article>
}

function NonFunctionalRequirements({ report, categories }) {
    return <article>
        <h2>Quality Attributes</h2>
        <p>The quality attributes identified for the <b><i>{report.name}</i></b> project are grouped below in the following categories:  </p>

        <ul>
            {categories.map((category) =>
                <li key={category.id}>
                    {category.name}
                </li>
            )}
        </ul>
    </article>
}

function Category({ report, category }) {

    return <article>
        <h2>Category:  {category.name}</h2>
        <p>{category.description }</p>
        {category.subCategories.map((subCategory) =>
            <SubCategory key={subCategory.id} report={report} subCategory={subCategory} />
        )}

    </article>
}

function SubCategory({ report, subCategory }) {

    const result = report.requirements.filter((requirement) => requirement.subCategoryId === subCategory.id);

    return <div>
        {result && result.length > 0 && <div>
            <h3>Sub-Characteristic: {subCategory.name}</h3>
            <p>{subCategory.description}</p>
            <Requirement report={report} requirements={result} />
        </div>}
    </div>
}

function Requirement({ report, requirements }) {

    return <>

        {requirements.map((requirement) =>
            <article>
                <table key={requirement.id} className="reqTable">
                    <colgroup>
                        <col className="width-20" />
                        <col className="width-80" />
                    </colgroup>            
                    <thead>
                        <tr>
                            <th>ID#: {requirement.identifier}</th>
                            <th>Quality Attribute: <i>{requirement.title}</i></th>
                        </tr>
                    </thead>
                    <tbody>
                        <TwoColumnRow title="Description"      value={requirement.description} />
                        <TwoColumnRow title="Priority"         value={requirement.priority} />
                        <TwoColumnRow title="Status"           value={requirement.status} />
                        <TwoColumnRow title="Rationale"        value={requirement.rationale} />
                        <TwoColumnRow title="Risk if Violated" value={requirement.riskIfViolated} />
                    </tbody>
                </table>

                <Measurements measurements={report.measurements} requirement={requirement} />

            </article>

        )}
    </>
}

function Measurements( {measurements, requirement} ) {

    const result = measurements.filter((measurement) => measurement.requirementId === requirement.id);
    
    return <>
        { result && result.length > 0 && <div className="title">Measured by:</div>}

        { result && result.length > 0 && <table>
            <colgroup>
                <col className="width-20" />
                <col className="width-80" />
            </colgroup>            
            <tbody>
                { result.map( measurement => 
                    <Measurement measurement={measurement} />
                )}
            </tbody>
        </table>
        }
    </>;
}

function Measurement( {measurement} ) {

    return <>
        { measurement.targetValue        && <TwoColumnRow title="Target Value"       value={measurement.targetValue} /> }
        { measurement.thresholdValue     && <TwoColumnRow title="Threshold Value"    value={measurement.thresholdValue} /> }
        { measurement.unit               && <TwoColumnRow title="Unit"               value={measurement.unit} /> }
        { measurement.measurementMethod  && <TwoColumnRow title="MeasurementMethod"  value={measurement.measurementMethod} /> }
        { measurement.trigger            && <TwoColumnRow title="Trigger"            value={measurement.trigger} /> }
        { measurement.context            && <TwoColumnRow title="Context"            value={measurement.context} /> }
        { measurement.systemResponse     && <TwoColumnRow title="System Response"    value={measurement.systemResponse} /> }
        { measurement.owner              && <TwoColumnRow title="Owner"              value={measurement.owner} /> }
        { measurement.acceptanceCriteria && <TwoColumnRow title="Acceptance Criteria" value={measurement.acceptanceCriteria} /> }
        { measurement.notes              && <TwoColumnRow title="notes"              value={measurement.notes} /> }
    </>;
}

export async function loader({ request, params }) {
    const reportId = params.id;
    const report = await getReport(reportId);
    const categories = await getCategories();
    const user = await getUser(report.userId)

    const data = {
        report,
        categories,
        user
    }

    return data;
}


