import TRRequest from '../trrequest/trrequest';
import User from '../user/user';
import * as Actions from './actions';
import { TRMSState } from './store';


export const initialState: TRMSState = {
    loginUser: undefined,
    myRequests: null,
    reviewRequests: null
}

const reducer = (state: TRMSState = initialState, action: Actions.TRMSAction): TRMSState => {

    const newState = {...state};

    switch (action.type) {
        case Actions.UserActions.ChangeLoginUser:
            if(action.payload)
                newState.loginUser = action.payload as User;
            else
                newState.loginUser = null;
            return newState;
        case Actions.RequestActions.ChangeMyRequests:
            if(action.payload)
                newState.myRequests = action.payload as TRRequest[];
            else
                newState.myRequests = null;
            return newState;
        case Actions.RequestActions.AddMyRequests:
            if(newState.myRequests)
                newState.myRequests.push(action.payload as TRRequest);
            else
                newState.myRequests = [action.payload as TRRequest];
            return newState;
        case Actions.RequestActions.ChangeReviewRequests:
            if(action.payload)
                newState.reviewRequests = action.payload as TRRequest[];
            else
                newState.reviewRequests = null;
            return newState;
        default: 
            return state;
    }
}

export default reducer;