import { useSelector } from 'react-redux';
import Card from 'react-bootstrap/Card';

import RequestListComponent from './request-list.component';
import { TRMSState } from './store/store';

function MyRequestsComponent() {
    const myRequests = useSelector((state: TRMSState) => state.myRequests);

    return(
        <Card>
            <h5>Your requests</h5>
            <RequestListComponent 
                fields={['eventname', 'date', 'projected', 'approvalstatus', 'nexttoapprove']}
                fieldTitles={['Event', 'Date', 'Projected Reimbursement', 'Status', 'Waiting On']} 
                requestList={myRequests} 
                emptyMessage={'You have no submitted requests'}
                reviewButtons={false}
            />
        </Card>
    );
}

export default MyRequestsComponent;