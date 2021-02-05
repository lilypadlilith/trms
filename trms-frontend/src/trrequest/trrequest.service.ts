import axios from 'axios';
import User from '../user/user';
import TRRequest from './trrequest';

class TRRequestService {
    private URI: string;
    constructor() {
        this.URI = process.env.REACT_APP_SERVER_URI+'requests';
    }

    getMyRequests(user: User): Promise<TRRequest[]> {
        return axios.get(this.URI+'/'+(user.username), {withCredentials: true}).then(result => {
            console.log(`Recieved ${JSON.stringify(result.data)} from ${this.URI}requests`);
            return result.data;
        });
    }

    getReviewRequests(user: User): Promise<TRRequest[]> {
        return axios.get(this.URI+'/'+(user.username)+'/review', {withCredentials: true}).then(result => {
            console.log(`Recieved ${JSON.stringify(result.data)} from ${this.URI}requests`);
            return result.data;
        });
    }

    putRequest(request: TRRequest): Promise<null> {
        return axios.post(this.URI, request, {withCredentials: true}).then(result => null);
    }
}

export default new TRRequestService();