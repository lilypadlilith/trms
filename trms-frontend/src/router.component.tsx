import React, { useEffect, useState } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import Navbar from "react-bootstrap/Navbar";
import Card from 'react-bootstrap/Card'

import ErrorBoundaryComponent from './error.component';
import HomeComponent from './home.component';
import LoginComponent from './login.component';
import NewRequestComponent from './new-request.component';
import ReviewRequestComponent from './review-request.component';
import { TRMSState, UserState } from './store/store';
import { changeLoginUser, changeMyRequests, changeReviewRequests } from './store/actions';
import userService from './user/user.service';
import requestService from './trrequest/trrequest.service';
import MyRequestsComponent from './my-requests.component';

export default function RouterComponent() {
    const user = useSelector((state: UserState) => state.loginUser);
    const myRequests = useSelector((state: TRMSState) => state.myRequests);
    const dispatch = useDispatch();
    const location = useLocation();

    function logout() {
        userService.logout().then(() => {
            dispatch(changeLoginUser(null));
        });
    }

    useEffect(() => {
        // Check for user in session
        userService.getLogin().then((user) => {
            if(user) {
              dispatch(changeLoginUser(user));
              // Get this user's requests
              requestService.getMyRequests(user).then((requests)=>{
                dispatch(changeMyRequests(requests));
              }).catch((err)=>{
                console.error('Error getting myRequests: '+err);
              });
              // Get this user's requests to review
              requestService.getReviewRequests(user).then((requests)=>{
                dispatch(changeReviewRequests(requests));
              }).catch((err)=>{
                console.error('Error getting reviewRequests: '+err);
              });
            }
        }).catch(()=>{
          console.log('Could not get session user');
          dispatch(changeLoginUser(null));
        });
    }, [dispatch, location]);
    
    return (
        <div>
            <Navbar bg='dark' variant='dark'>
                <Navbar.Brand>TRMS</Navbar.Brand>
                <Nav>
                    <Nav.Link href='/'>Home</Nav.Link>
                    {myRequests && <Nav.Link href='/myrequests'>My Requests</Nav.Link>}
                </Nav>
                {user && <Navbar.Collapse className='justify-content-end'>
                    <Navbar.Text>Welcome {user.realname}!</Navbar.Text>
                    <Nav.Link onClick={logout}>Log Out</Nav.Link>
                </Navbar.Collapse>}
            </Navbar>
            <ErrorBoundaryComponent key={location.pathname}>
                <Route
                    path='/'
                    // If no user is logged in regardless of the view, redirect to login page
                    render={() =>
                        (user === null) && <Redirect to='/login'/>
                    }
                />
                <Route exact path='/' component={HomeComponent}/>
                <Route exact path='/login' component={LoginComponent}/>
                <Route exact path='/newform' component={NewRequestComponent}/>
                <Route exact path='/myrequests' component={MyRequestsComponent}/>
                <Route exact path='/review/:index' component={ReviewRequestComponent}/>
            </ErrorBoundaryComponent>
        </div>
    );
}
