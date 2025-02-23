// Profile.js
import React, { useEffect } from "react";
import { useQuery, gql } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect(); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, loginWithRedirect]);

        const GET_DATA = gql`
            query GetUsers($username : String!) {
              employees (where: {email: {_eq: $username}}){
                employeeid
                departmentid
              }
            }`
            ;

      const { loading, error, data } = useQuery(GET_DATA, {
        variables: {
          "username": user ? user.name : "default"
        },
        fetchPolicy: 'network-only' // Set fetchPolicy to 'network-only' to increase timeout
      });

      if(loading){
        console.log( 'Loading...');
      }
      if(error){
        console.log(error.cause);
      }
      if (data){
        let employees = data['employees'];
        let employeeid = employees[0].employeeid;
        let departmentid = employees[0].departmentid;
        console.log(employeeid);


  return (
    isAuthenticated && (
      <div className="profile-container">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {employeeid && <p>User ID: {employeeid}</p>}
        {departmentid && <p>User Role: {departmentid}</p>}
      </div>
    )
  );
};
}

export default Profile;