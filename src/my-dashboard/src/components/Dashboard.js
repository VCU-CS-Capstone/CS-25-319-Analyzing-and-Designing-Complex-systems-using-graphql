import React, { useEffect, useRef, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import './Dashboard.css'; // Import the CSS file
import { Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner } from 'react-bootstrap';
import ScrollToTop from "./ScrollToTop";

function Dashboard() {
  const limit = 8; // Number of items per page
  const tableRef = useRef(null); // Create a ref for the table element
  const { isAuthenticated, loginWithRedirect, user } = useAuth0(); // Auth0 hook

  let role;
  let id = '0';

  if(user){
    role = user["https://hasura.io/jwt/claims"]["x-hasura-role"]
    id = user['https://hasura.io/jwt/claims']['x-hasura-user-id']

    console.log(role)
  }
  else{
    loginWithRedirect();
  }

    const GET_DATA = gql`
    query GetData(
      $employeesOffset: Int, $transactionsOffset: Int,
      $inventoryOffset: Int, $customersOffset: Int, $limit: Int, $id: String
    ) {
      ${role === "HR_Manager" || role === "HR_Employee" ? `
        employees(offset: $employeesOffset, limit: $limit) {
          employeeid firstname lastname email department
        }
        employees_aggregate { aggregate { count } }
      ` : role === "Sales_Manager" ? `
        employees(where: { departmentid: { _eq: "102" } }, offset: $employeesOffset, limit: $limit) {
          employeeid firstname lastname email department
        }
        employees_aggregate(where: { departmentid: { _eq: "102" } }) { aggregate { count } }
      ` : role === "IT_Manager" ? `
        employees(offset: $employeesOffset, limit: $limit) {
          employeeid firstname lastname email department
        }
        employees_aggregate(where: { departmentid: { _eq: "103" } }) { aggregate { count } }
      ` : `
        employees {
          employeeid firstname lastname email department
        }
        employees_aggregate { aggregate { count } }
      `}      
      
      ${["host", "Sales_Manager", "Sales_Employee",].includes(role) ? `
        transactions(offset: $transactionsOffset, limit: $limit) {
          transactionid buyerid sellerid totalprice transactiondate
        }
        transactions_aggregate { aggregate { count } }
      ` : ""}

      ${["host", "IT_Manager", "IT_Employee"].includes(role) ? `
        inventory(offset: $inventoryOffset, limit: $limit) {
          itemid itemdescription availablequantity itemprice
        }
        inventory_aggregate { aggregate { count } }
      ` : ""}

      ${["host", "Sales_Manager", "Sales_Employee"].includes(role) ? `
        customers(offset: $customersOffset, limit: $limit) {
          customerid firstname lastname email phone address lastpurchasedate
        }
        customers_aggregate { aggregate { count } }
      ` : ""}
    }
  `;


  const [employeesPage, setEmployeesPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);



  const { loading, error, data, fetchMore } = useQuery(GET_DATA, {
    variables: {
      employeesOffset: (employeesPage - 1) * limit,
      transactionsOffset: (transactionsPage - 1) * limit,
      inventoryOffset: (inventoryPage - 1) * limit,
      customersOffset: (customersPage - 1) * limit,
      limit: limit,
      id: id
    },
    fetchPolicy: 'network-only'
  });

  console.log(data)

  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);

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
    if (employeesPage > 1 || transactionsPage > 1 || inventoryPage > 1 || customersPage > 1) {
      fetchMore({
        variables: {
          employeesOffset: (employeesPage - 1) * limit,
          transactionsOffset: (transactionsPage - 1) * limit,
          inventoryOffset: (inventoryPage - 1) * limit,
          customersOffset: (customersPage - 1) * limit,
          limit: limit
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            Employees: fetchMoreResult.employees,
          };
        },
      });
    }
  }, [fetchMore, limit, customersPage, employeesPage, inventoryPage, transactionsPage]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handlePageChange = (tableKey, setPage, newPage) => {
    setLoadingState(true); 
  
    fetchMore({
      variables: {
        employeesOffset: (tableKey === 'employees' ? (newPage - 1) * limit : (employeesPage - 1) * limit),
        transactionsOffset: (tableKey === 'transactions' ? (newPage - 1) * limit : (transactionsPage - 1) * limit),
        inventoryOffset: (tableKey === 'inventory' ? (newPage - 1) * limit : (inventoryPage - 1) * limit),
        customersOffset: (tableKey === 'customers' ? (newPage - 1) * limit : (customersPage - 1) * limit),
        limit: limit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setTimeout(() => setLoadingState(false), 500); 
        return fetchMoreResult || prev;
      },
    });
  
    setPage(newPage);
  };
  

  const tables = [
    {
      title: 'Employees',
      data: data?.employees || [],
      columns: ['employeeid', 'firstname', 'lastname', 'email', 'department'],
      page: employeesPage,
      setPage: setEmployeesPage,
      totalPages: Math.ceil((data?.employees_aggregate?.aggregate?.count || 0) / limit),
    },
    {
      title: 'Transactions',
      data: data?.transactions || [],
      columns: ['transactionid', 'buyerid', 'sellerid', 'totalprice', 'transactiondate'],
      page: transactionsPage,
      setPage: setTransactionsPage,
      totalPages: Math.ceil((data?.transactions_aggregate?.aggregate?.count || 0) / limit),
    },
    {
      title: 'Inventory',
      data: data?.inventory || [],
      columns: ['itemid', 'itemdescription', 'availablequantity', 'itemprice'],
      page: inventoryPage,
      setPage: setInventoryPage,
      totalPages: Math.ceil((data?.inventory_aggregate?.aggregate?.count || 0) / limit),
    },
    {
      title: 'Customers',
      data: data?.customers || [],
      columns: ['customerid', 'firstname', 'lastname', 'email', 'phone', 'address', 'lastpurchasedate'],
      page: customersPage,
      setPage: setCustomersPage,
      totalPages: Math.ceil((data?.customers_aggregate?.aggregate?.count || 0) / limit),
    },
  ]; 
  
  return (
    <div className="center-container">
      <ScrollToTop/>
      {loadingState && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <div className="container">
        {tables.filter(table => table.data.length>0).map((table) => (
          <div className="card mb-4" key={table.title}>
            <div className="card-header">
              <h3>{table.title}</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive" style={{ maxHeight: '50vh' }}>
                <table className="table table-bordered table-striped" ref={tableRef}>
                  <thead>
                    <tr>
                      {table.columns.map((col) => (
                        <th key={col}>{col.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.data.map((row, idx) => (
                      <tr key={idx}>
                        {table.columns.map((col) => (
                          <td key={col}>{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer text-center">
            <Button onClick={() => handlePageChange(table.key, table.setPage, table.page - 1)} disabled={table.page === 1 || loadingState}>                
              Previous
            </Button>
            <span className="page-number">{`Page ${table.page} of ${table.totalPages}`}</span>
            <Button onClick={() => handlePageChange(table.key, table.setPage, table.page + 1)} disabled={table.page === table.totalPages || loadingState}>
              Next
            </Button>
            </div>
          </div>
        ))
        }
      </div>
    </div>
  );
}

export default Dashboard;