import TRRequest from '../trrequest/trrequest';
import User from '../user/user';

export enum UserActions {
    ChangeLoginUser = 'CHANGE_LOGIN_USER'
}

export enum RequestActions {
    ChangeMyRequests = 'CHANGE_MY_REQUESTS',
    AddMyRequests = 'ADD_MY_REQUESTS',
    ChangeReviewRequests = 'CHANGE_REVIEW_REQUESTS'
}

export interface TRMSAction {
    type: string;
    payload: any;
}

export interface UserAction extends TRMSAction {
    type: UserActions;
    payload: User | null;
}

export interface RequestAction extends TRMSAction {
    type: RequestActions;
    payload: TRRequest | TRRequest[] | null;
}

export function changeLoginUser(user: User | null): UserAction {
    const action: UserAction = {
        type: UserActions.ChangeLoginUser,
        payload: user
    }
    return action;
}

export function changeMyRequests(requests: TRRequest[] | null): RequestAction {
    const action: RequestAction = {
        type: RequestActions.ChangeMyRequests,
        payload: requests
    }
    return action;
}

export function addMyRequests(request: TRRequest): RequestAction {
    const action: RequestAction = {
        type: RequestActions.AddMyRequests,
        payload: request
    }
    return action;
}

export function changeReviewRequests(requests: TRRequest[] | null): RequestAction {
    const action: RequestAction = {
        type: RequestActions.ChangeReviewRequests,
        payload: requests
    }
    return action;
}