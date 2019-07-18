import React from 'react';
import { Button, Row, Col, Container, Table, Form, FormGroup } from "react-bootstrap";
import io from 'socket.io-client';
import Modal from 'react-modal';

import API from '../../utils/API';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

export class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            all: [],
            modalIsOpen: false,
            modalIsOpen2: false,
            id: ''
        }
        this.disconnect.bind(this);
        this.socket = io('http://localhost:8000');

        this.socket.on('all', (data) => {
            getData(data);
        });

        const getData = data => {
            this.setState({ all: data});
        };

        this.openModal2 = this.openModal2.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModal2 = this.closeModal2.bind(this);
    }

    openModal = event => {
        event.preventDefault();
        var idint = parseInt(event.target.name, 10);
        this.setState({
            modalIsOpen: true,
            id: idint
        });
    }
    
    closeModal() {
        this.setState({modalIsOpen: false,id: ''});
    }

    openModal2() {
        this.setState({
            modalIsOpen2: true
        });
    }
    
    closeModal2() {
        this.setState({modalIsOpen2: false});
    }

    disconnect = event => {
        API.logout();
        window.location = "/";
    }
    delete = event => {
        event.preventDefault();
        var idint = parseInt(event.target.name, 10);
        this.socket.emit('delete', idint);
    }

    handleSubmit = event => {
        event.preventDefault();
        var id = parseInt(event.target[0].getAttribute('data-key'), 10);
        var price = parseInt(event.target[2].value, 10);
        var rating = parseInt(event.target[3].value, 10);
        var warrantyYears = parseInt(event.target[4].value, 10);
        const editproducts = {
            "_id" : id,
            "name" : event.target[0].value,
            "type" : event.target[1].value,
            "price" : price,
            "rating" : rating,
            "warranty_years" : warrantyYears,
            "available" : event.target[5].checked
        }
        this.socket.emit('edit', editproducts, id);
        this.closeModal();
    }

    handleSubmit2 = event => {
        event.preventDefault();
        var id = this.state.all.length+1;
        var price = parseInt(event.target[2].value, 10);
        var rating = parseInt(event.target[3].value, 10);
        var warrantyYears = parseInt(event.target[4].value, 10);
        const newproducts = {
            "_id" : id,
            "name" : event.target[0].value,
            "type" : event.target[1].value,
            "price" : price,
            "rating" : rating,
            "warranty_years" : warrantyYears,
            "available" : event.target[5].checked
        }
        this.socket.emit('new', newproducts);
        this.closeModal2();
    }

    render() {
        return(
            <div className="Dashboard">
                <Container className="mt-4">
                    <Row>
                        <Col sm={10}>
                            <h1>Dashboard</h1>
                        </Col>
                        <Col sm={2}>
                            <Button
                            variant="light"
                            onClick={this.disconnect}
                            block
                            style={{width: "80px", float: 'right'}}
                            type="submit"
                            >
                            Sign out
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={10}>
                            <div>
                                <br></br>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th className="text-center">Name</th>
                                            <th className="text-center">Type</th>
                                            <th className="text-center">Price</th>
                                            <th className="text-center">Rating</th>
                                            <th className="text-center">Warranty years</th>
                                            <th className="text-center">Edit</th>
                                            <th className="text-center">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.all.map(get =>
                                            <tr key={get._id}>
                                                <td>{get.name}</td>
                                                <td>{get.type}</td>
                                                <td>{get.price}</td>
                                                <td>{get.rating}</td>
                                                <td>{get.warranty_years}</td>
                                                <td>
                                                <Button
                                                    onClick={this.openModal}
                                                    block
                                                    type="submit"
                                                    name={get._id}
                                                    >
                                                Edit
                                                </Button>
                                                </td>
                                                <td>
                                                    <Button 
                                                    variant="danger"
                                                    onClick={this.delete}
                                                    block
                                                    type="submit"
                                                    name={get._id}
                                                    >X
                                                    </Button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                        <Col sm={2}>
                            <br></br>
                            <Button onClick={this.openModal2} variant="success" style={{width: '60px', float: 'right'}}>New</Button>
                            <br></br>
                        </Col>
                    </Row>
                </Container>
                {/* Edit */}
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Edit product</h2>
                    {this.state.all.map(get => 
                        (get._id === this.state.id ? 
                        <Form key={get._id} onSubmit={this.handleSubmit}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control data-key={get._id} type="text" placeholder={get.name} required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Type</Form.Label>
                                <Form.Control type="text" placeholder={get.type} required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" min="1" placeholder={get.price} required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control type="number" step="0.1" min="1" placeholder={get.rating} required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Warranty years</Form.Label>
                                <Form.Control type="number" min="1" placeholder={get.warranty_years} required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Available</Form.Label>
                                <Form.Check type="radio" label="true" name="available" id="true" required/>
                                <Form.Check type="radio" label="false" name="available" id="false"/>
                            </Form.Group>

                            <FormGroup>
                                <Button type="submit">Send</Button>
                            </FormGroup>
                        </Form>
                        : '')
                    )}
                    <Button variant="secondary" onClick={this.closeModal} style={{float: "right"}}>Close</Button>
                </Modal>

                {/* Create */}
                <Modal
                    isOpen={this.state.modalIsOpen2}
                    onRequestClose={this.closeModal2}
                    style={customStyles}
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Create product</h2>
                        <Form onSubmit={this.handleSubmit2}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Type</Form.Label>
                                <Form.Control type="text" required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" min="1" required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control type="number" step="0.1" min="1" required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Warranty years</Form.Label>
                                <Form.Control type="number" min="1" required/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Available</Form.Label>
                                <Form.Check type="radio" label="true" name="available" id="true" required/>
                                <Form.Check type="radio" label="false" name="available" id="false"/>
                            </Form.Group>

                            <FormGroup>
                                <Button type="submit">Send</Button>
                            </FormGroup>
                        </Form>
                    <Button variant="secondary" onClick={this.closeModal2} style={{float: "right"}}>Close</Button>
                </Modal>
            </div>
        )
    }
}