import React from 'react';
import { Button, FormGroup, FormControl, Container, Row, Col } from "react-bootstrap";
import API from '../../utils/API';

export class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password: "",
            cpassword: ""
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }
    send = event => {
        if(this.state.email.length === 0){
            return;
        }
        if(this.state.password.length === 0 || this.state.password !== this.state.cpassword){
            return;
        }
        var _send = {
            email: this.state.email,
            password: this.state.password
        }
        API.signup(_send).then(function(data){
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
    login = event => {
        window.location = "/";
    }
    render() {
        return(
            <div className="Login">
                <Container>
                    <Row>
                        <Col sm={8} className="mt-5">
                            <h4>Create your account</h4>
                            <hr></hr>
                            <FormGroup controlId="email">
                                <label>Email</label>
                                <FormControl autoFocus type="email" value={this.state.email} onChange={this.handleChange}/>
                                </FormGroup>
                                <FormGroup controlId="password">
                                <label>Password</label>
                                <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
                                </FormGroup>
                                <FormGroup controlId="cpassword">
                                <label>Confirm Password</label>
                                <FormControl value={this.state.cpassword} onChange={this.handleChange} type="password"/>
                            </FormGroup>
                            <Button
                            onClick={this.send}
                            block
                            type="submit"
                            >
                            Sign Up
                            </Button>
                        </Col>
                        <Col sm={4} className="mt-5">
                            <h4>If you already have an account, click here</h4>
                            <hr></hr>
                            <Button
                            onClick={this.login}
                            block
                            className="mt-3"
                            type="submit"
                            >Login</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}