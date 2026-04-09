import Document from "../ui/Document";

import SprintPlan from "../assets/SprintPlan.pdf";

function About() {

    return (
        <article>
            <h1>About NFR Report Builder</h1>
            <div className="tile-container">
                <Document type="javadoc" title="Backend JavaDoc" location="#" />
                <Document type="swagger" title="Backend Swagger Docs" location="http://localhost:8080/swagger-ui/index.html" />
                <Document type="pdf" title="Sprint Plan" location={SprintPlan} />
                <Document type="pdf" title="Architectural Design" location="#" />
                <Document type="pdf" title="Technical Design" location="#" />
                <Document type="pdf" title="Test Plan" location="#" />
            </div>
        </article>
    );
}

export default About;