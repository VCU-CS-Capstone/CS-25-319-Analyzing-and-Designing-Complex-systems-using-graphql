import React, { useEffect, useRef, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import './Dashboard.css'; // Import the CSS file
import { Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole } from '../UserContext'; // Import the context

const GET_DATA = gql`
  query MyQuery($offset: Int!, $limit: Int!){
  employees(offset: $offset, limit: $limit) {
    departmentid
    employeeid
    department
    email
    firstname
    lastname
  }
}
`;

function Dashboard() {
  const [page, setPage] = useState(1);
  const limit = 10; // Number of items per page
  const tableRef = useRef(null); // Create a ref for the table element
  const { isAuthenticated, loginWithRedirect } = useAuth0(); // Auth0 hook
  const { userRole } = useUserRole(); // Access userRole from context
  let totalPages = 1;

  const { loading, error, data, fetchMore } = useQuery(GET_DATA, {
    variables: {
      offset: (page - 1) * limit,
      limit: limit
    },
    fetchPolicy: 'network-only' // Set fetchPolicy to 'network-only' to increase timeout
  });

  console.log(data)

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect(); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, loginWithRedirect]);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to the table when it's rendered
    }
  }, [data]);

  useEffect(() => {
    if (page > 1) {
      fetchMore({
        variables: {
          offset: (page - 1) * limit,
          limit: limit
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            Table3: fetchMoreResult.Table3,
          };
        },
      });
    }
  }, [page, fetchMore, limit]);

  useEffect(() => {
    const totalEmployeeRows = data?.employees?.aggregate?.totalCount || 0;
    const totalRows = totalEmployeeRows;
    const totalPages = Math.ceil(totalRows / limit);
  
    if (page < Math.ceil(totalRows / limit)) {
      fetchMore({
        variables: {
          offset: page * limit,
          limit: limit
        },
      });
    }
  }, [page, data, fetchMore, limit]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  

  const handlePrevious = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className="center-container">
      <div className="container" style={{ marginTop: "250px" }}>
        <div className="card">
          <div className="card-header">
            <div className="button-group">
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive" style={{ maxHeight: "70vh" }}>
              <table className="table table-bordered table-striped" ref={tableRef}>
                <thead>
                  <tr>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {data.Table3 && data.Table3.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.bnb_name}</td>
                    </tr>
                  ))}
                  {data.Table2 && data.Table2.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.bnb_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer text-center">
            <Button onClick={handlePrevious} disabled={page === 1}>Previous</Button>
            <span className="page-number">{`Page ${page} of ${totalPages}`}</span>
            <Button onClick={handleNext} disabled={page === totalPages}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;