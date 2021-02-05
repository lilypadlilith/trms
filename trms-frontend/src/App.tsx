import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import RouterComponent from './router.component';
import userService from './user/user.service';
import requestService from './trrequest/trrequest.service';
import { changeLoginUser, changeMyRequests, changeReviewRequests } from './store/actions';
import { UserState } from './store/store';

function App() {
  const dispatch = useDispatch();

  // useEffect(() => {
  //     // Check for user in session
  //     userService.getLogin().then((user) => {
  //         if(user) {
  //           dispatch(changeLoginUser(user));
  //           // Get this user's requests
  //           requestService.getMyRequests(user).then((requests)=>{
  //             dispatch(changeMyRequests(requests));
  //           }).catch((err)=>{
  //             console.error('Error getting myRequests: '+err);
  //           });
  //           // Get this user's requests to review
  //           requestService.getReviewRequests(user).then((requests)=>{
  //             dispatch(changeReviewRequests(requests));
  //           }).catch((err)=>{
  //             console.error('Error getting reviewRequests: '+err);
  //           });
  //         }
  //     }).catch(()=>{
  //       console.log('Could not get session user');
  //       dispatch(changeLoginUser(null));
  //     });
  // }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <RouterComponent/>
      </BrowserRouter>
    </div>
  );
}

export default App;
