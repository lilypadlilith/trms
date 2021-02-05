import { useState, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { changeLoginUser } from './store/actions';
import userService from './user/user.service';
import User from './user/user';

function LoginComponent() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [formName, setFormName] = useState('');
    const [formPass, setFormPass] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState(false);

    function handleFormInput(e: SyntheticEvent) {
        if((e.target as HTMLInputElement).name === 'username') {
            setFormName((e.target as HTMLInputElement).value);
        } else {
            setFormPass((e.target as HTMLInputElement).value);
        }
    }

    function submitForm() {
        setLoggingIn(true);
        setLoginError(false);
        userService.login(new User(formName, formPass)).then((user) => {
            setLoggingIn(false);
            if(user === null) {
                setLoginError(true);
            }else {
                setLoginError(false);
                dispatch(changeLoginUser(user));
                history.push('/');
            }
        }).catch(()=>{
            setLoggingIn(false);
            setLoginError(true);
        });
    }

    return(
        <Form className='form-login'>
            <Form.Group>
                <h2>Please Log In</h2>
                { loginError && (<Form.Label className='error-msg'>Invalid username or password</Form.Label>) }
                <Form.Control name='username' type='text' placeholder='Username' onChange={handleFormInput}></Form.Control>
                <Form.Control name='password' type='password' placeholder='Password' onChange={handleFormInput}></Form.Control>
            </Form.Group>
            <Button variant='info' onClick={submitForm} disabled={!formName || !formPass || loggingIn}>
                { loggingIn ? 'Logging In...' : 'Log In' }
            </Button>
        </Form>
    );
}

export default LoginComponent;