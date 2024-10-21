import React, { useEffect, useRef, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import './Dashboard.css'; // Import the CSS file
import { Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole } from '../UserContext'; // Import the context

const GET_DATA = gql`
  query MyQuery($offset: Int!, $limit: Int!) {
    Table3(offset: $offset, limit: $limit) {
      id
      bnb_name
      host_id
      host_name
      neighborhood_group
      neighborhood
      latitude
      longitude
      room_type
      price
      minimum_nights
      number_of_reviews
      last_review
      reviews_per_month
      calculated_host_listings_count
      availability_365
    }
    Table3_aggregate {
      aggregate {
        totalCount: count
      }
    }
    Table2(offset: $offset, limit: $limit) {
      id
      bnb_name
      host_id
      host_name
      neighborhood_group
      neighborhood
      latitude
      longitude
      room_type
      price
      minimum_nights
      number_of_reviews
      last_review
      reviews_per_month
      calculated_host_listings_count
      availability_365
    }
    Table2_aggregate {
      aggregate {
        totalCount: count
      }
    }
  }
`;

function Dashboard() {
  const [page, setPage] = useState(1);
  const limit = 10; // Number of items per page
  const tableRef = useRef(null); // Create a ref for the table element
  const { isAuthenticated, loginWithRedirect } = useAuth0(); // Auth0 hook
  const { userRole } = useUserRole(); // Access userRole from context

  const { loading, error, data, fetchMore } = useQuery(GET_DATA, {
    variables: {
      offset: (page - 1) * limit,
      limit: limit
    },
    fetchPolicy: 'network-only' // Set fetchPolicy to 'network-only' to increase timeout
  });

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
    const totalTable3Rows = data?.Table3_aggregate?.aggregate?.totalCount || 0;
    const totalTable2Rows = data?.Table2_aggregate?.aggregate?.totalCount || 0;
    const totalRows = totalTable3Rows + totalTable2Rows;
  
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

  const totalTable3Rows = data.Table3_aggregate.aggregate.totalCount;
  const totalTable2Rows = data.Table2_aggregate.aggregate.totalCount;
  const totalRows = totalTable3Rows + totalTable2Rows;
  const totalPages = Math.ceil(totalRows / limit);

  const handlePrevious = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const insertButton = () => {
    
  };
  const updateButton = () => {
    
  };
  const deleteButton = () => {
    
  };

  return (
    <div className="center-container">
      <div className="container" style={{ marginTop: "250px" }}>
        <div className="card">
          <div className="card-header">
            <h2 className="text-center">Records for {userRole}</h2> {/* Update the title */}
            <div className="button-group">
            <Button
              onClick={insertButton}
              disabled={userRole && userRole.toString() === 'user'}
              className={userRole && userRole.toString() === 'user' ? 'btn-disabled' : ''}
            >
              Insert
            </Button>
            <Button
              onClick={updateButton}
              disabled={userRole && userRole.toString() === 'user'}
              className={userRole && userRole.toString() === 'user' ? 'btn-disabled' : ''}
            >
              Update
            </Button>
            <Button
              onClick={deleteButton}
              disabled={userRole && userRole.toString() === 'user'}
              className={userRole && userRole.toString() === 'user' ? 'btn-disabled' : ''}
            >
              Delete
            </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive" style={{ maxHeight: "70vh" }}>
              <table className="table table-bordered table-striped" ref={tableRef}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>BNB Name</th>
                    <th>Host ID</th>
                    <th>Host Name</th>
                    <th>Neighborhood Group</th>
                    <th>Neighborhood</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Room Type</th>
                    <th>Price</th>
                    <th>Minimum Nights</th>
                    <th>Number of Reviews</th>
                    <th>Last Review</th>
                    <th>Reviews Per Month</th>
                    <th>Calculated Host Listings Count</th>
                    <th>Availability 365</th>
                  </tr>
                </thead>
                <tbody>
                  {data.Table3 && data.Table3.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.bnb_name}</td>
                      <td>{item.host_id}</td>
                      <td>{item.host_name}</td>
                      <td>{item.neighborhood_group}</td>
                      <td>{item.neighborhood}</td>
                      <td>{item.latitude}</td>
                      <td>{item.longitude}</td>
                      <td>{item.room_type}</td>
                      <td>{item.price}</td>
                      <td>{item.minimum_nights}</td>
                      <td>{item.number_of_reviews}</td>
                      <td>{item.last_review}</td>
                      <td>{item.reviews_per_month}</td>
                      <td>{item.calculated_host_listings_count}</td>
                      <td>{item.availability_365}</td>
                    </tr>
                  ))}
                  {data.Table2 && data.Table2.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.bnb_name}</td>
                      <td>{item.host_id}</td>
                      <td>{item.host_name}</td>
                      <td>{item.neighborhood_group}</td>
                      <td>{item.neighborhood}</td>
                      <td>{item.latitude}</td>
                      <td>{item.longitude}</td>
                      <td>{item.room_type}</td>
                      <td>{item.price}</td>
                      <td>{item.minimum_nights}</td>
                      <td>{item.number_of_reviews}</td>
                      <td>{item.last_review}</td>
                      <td>{item.reviews_per_month}</td>
                      <td>{item.calculated_host_listings_count}</td>
                      <td>{item.availability_365}</td>
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
