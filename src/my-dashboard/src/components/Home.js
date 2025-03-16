import React from 'react';
import '../styles.css'; 

const Home = () => {
  return (
    <div className="centered">
      <h2>Welcome to Your Dashboard</h2>
      <h2>Analyzing and Designing Complex Systems using GraphQL</h2>

      <p className="fade-in">
        <strong>Team members:</strong> Jayson Urena, Diya Ram Mohan, Houda Lahrouz, Montel Marks  |  
        <strong> Faculty advisor:</strong> Thomas Gyeera |  
        <strong> Sponsor:</strong> Bank of America  |  
        <strong> Mentor:</strong> Shailesh Deshpande
      </p>

      <p className="fade-in">
        Bank of America is looking to create a shared services layer to centralize and standardize
        how data is served to the business. In the first phase of this project, the foundation 
        was established with a dashboard integrated with SQL databases, using tools such as Hasura, 
        Denodo, GraphQL, and Python. The second phase aims to expand functionality, introduce 
        additional tools, and enhance security measures within the application.
      </p>

      <h3 className="fade-in">Key Issues Addressed (Updated as the project progresses):</h3>

      <p className="fade-in">
        <strong>Data Visualization:</strong> Employees need proper visualization tools to interact with data.
        We addressed this by setting up Tableau with a free trial to ensure cost efficiency, and 
        integrated Tableau via cData’s GraphQL connector for seamless data visualization.
      </p>

      <p className="fade-in">
        <strong>Quality Control:</strong> Data inconsistencies and costly data leaks were key concerns. 
        Our team implemented strict quality control measures to maintain data integrity and prevent leaks.
      </p>

      <p className="fade-in">
        <strong>Access Control:</strong> Ensuring data security and privacy was a priority. 
        We set up a new Auth0 project and linked it with Hasura, creating a more secure, managed 
        access system for sensitive data.
      </p>

      <p className="fade-in">
        Additionally, we hosted data in Neon and deployed it on DDN, enhancing the application's scalability 
        and reliability. These improvements ensure a more secure, efficient, and data-driven 
        decision-making process.
      </p>

      <p className="fade-in"><strong>For more details, check out the project documentation:</strong></p>

      <p className="fade-in">
        <a 
          href="https://docs.google.com/document/d/1z_nveZSpjtSmoQu0QLi63wMSGfar7I6d/edit" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          📜 Team Contract
        </a>
      </p>

      <p className="fade-in">
        <a 
          href="https://docs.google.com/document/d/1CcifHrRiWv2cbfDGbOR8LciCy3SPe8KF/edit#heading=h.gjdgxs" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          📌 Project Proposal
        </a>
      </p>

      <p className="fade-in">
        <a 
          href="https://docs.google.com/document/d/1xU8KmYgVOt_UyI9Gqq43vIHlvRNclpFO/edit#heading=h.gjdgxs" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          🔍 Preliminary Design Report
        </a>
      </p> 
    </div>
  );
};

export default Home;
