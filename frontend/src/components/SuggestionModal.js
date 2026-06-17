import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class SuggestionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Suggestion</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="suggestion-title">Title</Label>
              <Input
                type="text"
                id="suggestion-title"
                name="title"
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Enter suggestion title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="suggestion-description">Description</Label>
              <Input
                type="textarea"
                id="suggestion-description"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter suggestion description"
              />
            </FormGroup>
            <FormGroup>
              <Label for="suggestion-status">Status</Label>
              <Input
                type="select"
                id="suggestion-status"
                name="status"
                value={this.state.activeItem.status}
                onChange={this.handleChange}
              >
                <option value="new">New</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave(this.state.activeItem)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
