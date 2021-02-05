import { applyMiddleware, createStore, Store } from "redux";
import thunk from "redux-thunk";

import User from "../user/user";
import TRRequest from '../trrequest/trrequest';
import { TRMSAction } from "./actions";
import reducer from "./reducer";

export interface UserState {
    // Null - no user is logged in
    // Undefined - there may be a user logged in, but the request to the get the session data hasn't returned yet
    loginUser: User | undefined | null;
    // Requests made by loginUser
    myRequests: TRRequest[] | null;
    // Requests labeled to be reviewed by loginUser
    reviewRequests: TRRequest[] | null;
}

export interface TRMSState extends UserState {}

const store: Store<TRMSState, TRMSAction> = createStore(reducer, applyMiddleware(thunk));

export default store;