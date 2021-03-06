import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAppContext } from "./contextLib";
import "./Login.css";

export default function Register() {
    const { userHasAuthenticated } = useAppContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    global.apiClient.register(username, password, password2).then((data) => {
        global.apiClient.accessToken = data['api_key'];
        global.apiClient.username = username;
        userHasAuthenticated(true);
    });
  }

  return (
    <div className="Register">
      <Form onSubmit={handleSubmit} className="col-md-4 col-12 px-sm-1">
        <Form.Group controlId="username" className="form-group mb-1 mb-md-3">
          <Form.Label className="mr-sm-2 mb-0 mb-sm-1">Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control mb-sm-0 mb-2 mr-sm-2 px-sm-1 py-sm-0"
          />
        </Form.Group>
        <Form.Group controlId="password" className="form-group mb-1 mb-md-3">
          <Form.Label className="mr-sm-2 mb-0 mb-sm-1">Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-sm-0 mb-2 mr-sm-2 px-sm-1 py-sm-0"
          />
        </Form.Group>
        <Form.Group controlId="password2" className="form-group mb-1 mb-md-3">
          <Form.Label className="mr-sm-2 mb-0 mb-sm-1">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="form-control mb-sm-0 mb-2 mr-sm-2 px-sm-1 py-sm-0"
          />
        </Form.Group>
        <Button block type="submit" disabled={!validateForm()} className="btn btn-primary btn-sm">
          Register
        </Button>
      </Form>
    </div>
  );
}