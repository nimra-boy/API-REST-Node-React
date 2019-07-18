import React from 'react';
import { Button, FormGroup, FormControl, Container, Row, Col } from "react-bootstrap";
import API from '../../utils/API';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password: ""
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }
    send = event => {
        if(this.state.email.length === 0){
            return;
        }
        if(this.state.password.length === 0){
            return;
        }
        API.login(this.state.email, this.state.password).then(function(data){
            localStorage.setItem('token', data.data.token);
            window.location = "/dashboard"
        },function(error){
            console.log(error);
            return;
        })
    }    
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    signup = event => {
        window.location = "/signup";
    }
    render() {
        return(
            <div className="Login">
                <Container>
                    <Row>
                        <Col sm={8} className="mt-5">
                            <div>
                                <h4>Please login to see the dashboard of products</h4>
                                <hr></hr>
                                <FormGroup controlId="email">
                                    <label>Email</label>
                                    <FormControl autoFocus type="email" value={this.state.email} onChange={this.handleChange}/>
                                    </FormGroup>
                                    <FormGroup controlId="password">
                                    <label>Password</label>
                                    <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
                                </FormGroup>
                                <Button
                                onClick={this.send}
                                block
                                type="submit"
                                >
                                Login
                                </Button>
                            </div>
                        </Col>
                        <Col sm={4} className="mt-5">
                            <div>
                                <h4>If you are not yet registered, click here</h4>
                                <hr></hr>
                                <Button
                                onClick={this.signup}
                                block
                                className="mt-3"
                                type="submit"
                                >Sign Up</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}