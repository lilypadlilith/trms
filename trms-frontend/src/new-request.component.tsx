import { useState, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { UserState, TRMSState } from './store/store';
import TRRequest, { TREvent, eventList, calculateProjected } from './trrequest/trrequest';
import requestService from './trrequest/trrequest.service';
import { addMyRequests } from './store/actions';

function NewRequestComponent() {
    const loginUser = useSelector((state: UserState) => state.loginUser);
    const myRequests = useSelector((state: TRMSState) => state.myRequests);
    const history = useHistory();
    const dispatch = useDispatch();
    // Form field values
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [gradeFormat, setGradeFormat] = useState('');
    const [justification, setJustification] = useState('');
    const [cost, setCost] = useState(0);
    const [projected, setProjected] = useState(0);
    // Validation
    const [isValidated, setIsValidated] = useState(false);
    // Status
    const [submitting, setSubmitting] = useState(false);

    useEffect(()=>{
        if(eventType && cost && myRequests != null) {
            let eType: TREvent = eventList.find(elem => (elem.eventname === eventType)) as TREvent;
            setProjected(calculateProjected(eType, cost, myRequests));
        }
    }, [eventType, cost, myRequests]);

    function handleFormInput(e: SyntheticEvent) {
        let elem: HTMLInputElement = (e.target as HTMLInputElement);
        //let validMessage: string = '';
        switch(elem.name) {
            case 'eventname': setEventName(elem.value);
                break;
            case 'eventtype': setEventType(elem.value);
                break;
            case 'description': setDescription(elem.value);
                break;
            case 'date':
                // Compare Date.parse(elem.value) to new Date().valueOf()
                setDate(elem.value);
                break;
            case 'time': setTime(elem.value);
                break;
            case 'location': setLocation(elem.value);
                break;
            case 'gradeformat': setGradeFormat(elem.value);
                break;
            case 'justification': setJustification(elem.value);
                break;
            case 'cost': setCost(Number(elem.value));
                break;
        }
    }

    function submitForm(e: SyntheticEvent) {
        let formElement: HTMLFormElement = ((e.target as HTMLInputElement).parentElement as HTMLFormElement);
        if(formElement) {
            setIsValidated(true);
            let valid: boolean = formElement.checkValidity();

            if(valid) {
                let request: TRRequest = new TRRequest(
                    loginUser?.username,
                    loginUser?.realname,
                    eventName,
                    eventList.find(elem => (elem.eventname === eventType)),
                    description,
                    date,
                    time,
                    location,
                    gradeFormat,
                    justification,
                    cost,
                    projected,
                    loginUser?.superior
                );
                setSubmitting(true);
                requestService.putRequest(request).then(()=>{
                    dispatch(addMyRequests(request));
                    setSubmitting(false);
                    history.push('/');
                }).catch((err)=>{
                    setSubmitting(false);
                    throw err;
                });
            }
        }
    }

    return(
        <Card>
            <Form className='claim-form' validated={isValidated}>
                <h2>Tuition Reimbursement Form</h2>
                <Form.Group>
                    <Row>
                        <Col xs='4'><Form.Label>Full Name</Form.Label></Col>
                        <Col>
                            <Form.Control name='fullname' type='text' readOnly value={loginUser?.realname}></Form.Control>
                        </Col>
                    </Row>
                </Form.Group>
                <h5>Event Details</h5>
                <Form.Group>
                    <Row>
                        <Col xs='4'><Form.Label>Event Name</Form.Label></Col>
                        <Col>
                            <Form.Control name='eventname' type='text' onChange={handleFormInput} required></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Event Type</Form.Label></Col>
                        <Col>
                            <Form.Control name='eventtype' as='select' defaultValue='' onChange={handleFormInput} required>
                                <option></option>
                                {eventList.map((value: TREvent) => {
                                    // Generate a control option for every event type
                                    return(
                                        <option>{value.eventname}</option>
                                    );
                                })}
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Description</Form.Label></Col>
                        <Col>
                            <Form.Control name='description' as='textarea' onChange={handleFormInput} required></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Date</Form.Label></Col>
                        <Col>
                            <Form.Control name='date' type='date' onChange={handleFormInput} required></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Time</Form.Label></Col>
                        <Col>
                            <Form.Control name='time' type='time' onChange={handleFormInput} required></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Location</Form.Label></Col>
                        <Col>
                            <Form.Control name='location' as='textarea' onChange={handleFormInput} required></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Grading Format</Form.Label></Col>
                        <Col>
                            <Form.Control name='gradeformat' as='textarea' onChange={handleFormInput} required></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Work-Related Justification</Form.Label></Col>
                        <Col>
                            <Form.Control name='justification' as='textarea' onChange={handleFormInput} required></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Total Cost</Form.Label></Col>
                        <Col>
                            <Form.Control name='cost' type='number' onChange={handleFormInput} min='0.01' step='0.01' required></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'><Form.Label>Projected Reimbursement:</Form.Label></Col>
                        <Col><Form.Label>{'$'+projected.toFixed(2)}</Form.Label></Col>
                    </Row>
                </Form.Group>
                <Button variant='info' onClick={submitForm} disabled={submitting} block>
                    {submitting? 'Submitting...' : 'Submit' }
                </Button>
            </Form>
        </Card>
    );
}

export default NewRequestComponent;