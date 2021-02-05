import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

import RequestListComponent from './request-list.component';
import requestService from './trrequest/trrequest.service';
import { changeMyRequests, changeReviewRequests } from './store/actions';
import { UserState, TRMSState } from './store/store';

function HomeComponent() {
    const loginUser = useSelector((state: UserState) => state.loginUser);
    const reviewRequests = useSelector((state: TRMSState) => state.reviewRequests);
    const history = useHistory();
    const dispatch = useDispatch();

    function newForm() {
        history.push('/newform');
    }

    return(
        <Card>
            <Button variant="info" onClick={newForm} size="lg" block>
                New Tuition Reimbursement Request
            </Button>
            { (loginUser && loginUser.role != 'employee' && reviewRequests) &&
                <>
                    <br/>
                    <Alert variant='warning'>
                        { reviewRequests.length === 1 ? 'A request needs your review!' : `(${reviewRequests.length}) requests need your review!` }
                    </Alert>
                    <RequestListComponent 
                        fields={['realname', 'eventname', 'projected', 'approvalstatus']}
                        fieldTitles={['Employee', 'Event', 'Reimbursement', 'Status']} 
                        requestList={reviewRequests} 
                        emptyMessage={'You\'re all caught up!'}
                        reviewButtons={true}
                    />
                </>
            }
        </Card>
    );
}

export default HomeComponent;