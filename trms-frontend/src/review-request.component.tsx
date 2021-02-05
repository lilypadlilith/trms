import { useState, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import { UserState, TRMSState } from './store/store';
import TRRequest from './trrequest/trrequest';
import requestService from './trrequest/trrequest.service';

interface RequestProps {
    match: any;
}

function ReviewRequestComponent(props: RequestProps) {
    const loginUser = useSelector((state: UserState) => state.loginUser);
    const reviewRequests = useSelector((state: TRMSState) => state.reviewRequests);
    const history = useHistory();
    const [thisRequest, setThisRequest] = useState(new TRRequest());

    const [declining, setDeclining] = useState(false);
    const [approving, setApproving] = useState(false);

    const [showingDeclineModal, setShowingDeclineModal] = useState(false);
    const [showingApproveModal, setShowingApproveModal] = useState(false);

    function showDeclineModal() { setShowingDeclineModal(true); }
    function closeDeclineModal() { setShowingDeclineModal(false); }

    function showApproveModal() { setShowingApproveModal(true); }
    function closeApproveModal() { setShowingApproveModal(false); }

    function declineForm() {
        let req: TRRequest = {...thisRequest};
        req.nexttoapprove = 'n/a';
        req.approvalstatus = 'declined';
        requestService.putRequest(req).then(()=>{
            history.push('/');
        });
    }

    function approveForm() {
        let req: TRRequest = {...thisRequest};
        if(loginUser) {
            if(loginUser.role == 'benco') {
                req.nexttoapprove = 'n/a';
                req.approvalstatus = 'approved';
            }
            else {
                req.nexttoapprove = loginUser?.superior;
            }
            requestService.putRequest(req).then(()=>{
                history.push('/');
            });
        }
    }

    useEffect(()=>{
        if(reviewRequests) {
            setThisRequest(reviewRequests[props.match.params.index]);
        }
    });

    return(
        <Card>
            <Form className='claim-form'>
                <h2>Tuition Reimbursement Request</h2>
                <Form.Group>
                    <Row>
                        <Col xs='4'><Form.Label>Full Name</Form.Label></Col>
                        <Col>
                            <Form.Control name='fullname' type='text' readOnly value={thisRequest.realname}></Form.Control>
                        </Col>
                    </Row>
                </Form.Group>
                <h5>Event Details</h5>
                <Form.Group>
                    <Row>
                        <Col xs='4'><Form.Label>Event Name</Form.Label></Col>
                        <Col>
                            <Form.Control name='eventname' type='text' value={thisRequest.eventname} readOnly></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Event Type</Form.Label></Col>
                        <Col>
                            <Form.Control name='eventtype' as='select' value={thisRequest.eventtype.eventname} readOnly>
                                <option>{thisRequest.eventtype.eventname}</option>
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Description</Form.Label></Col>
                        <Col>
                            <Form.Control name='description' as='textarea' value={thisRequest.description} readOnly></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Date</Form.Label></Col>
                        <Col>
                            <Form.Control name='date' type='date' value={thisRequest.date} readOnly></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Time</Form.Label></Col>
                        <Col>
                            <Form.Control name='time' type='time' value={thisRequest.time} readOnly></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Location</Form.Label></Col>
                        <Col>
                            <Form.Control name='location' as='textarea' value={thisRequest.location} readOnly></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Grading Format</Form.Label></Col>
                        <Col>
                            <Form.Control name='gradeformat' as='textarea' value={thisRequest.gradeformat} readOnly></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Work-Related Justification</Form.Label></Col>
                        <Col>
                            <Form.Control name='justification' as='textarea' value={thisRequest.justification} readOnly></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Total Cost</Form.Label></Col>
                        <Col>
                            <Form.Control name='cost' type='number' value={thisRequest.cost} readOnly></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Projected Reimbursement:</Form.Label></Col>
                        <Col><Form.Label>{'$'+thisRequest.projected.toFixed(2)}</Form.Label></Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col><Button variant='outline-info' disabled block>
                            Request Info
                        </Button></Col>
                        <Col><Button variant='danger' onClick={showDeclineModal} disabled={declining} block>
                            {declining? 'Declining...' : 'Decline' }
                        </Button></Col>
                        <Col><Button variant='success' onClick={showApproveModal} disabled={approving} block>
                            {approving? 'Approving...' : 'Approve' }
                        </Button></Col>
                    </Row>
                </Form.Group>
            </Form>

            <Modal id='decline-modal' show={showingDeclineModal} onHide={closeDeclineModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Decline Reimbursement Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please provide reasoning for decline
                    <Form.Control as='textarea'></Form.Control>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeclineModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={declineForm}>
                        Decline Request
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal id='approve-modal' show={showingApproveModal} onHide={closeApproveModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Approve Reimbursement Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>Approve this request?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeApproveModal}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={approveForm}>
                        Approve Request
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
        
    );
}

export default ReviewRequestComponent;