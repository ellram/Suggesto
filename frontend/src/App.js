import React, { Component } from "react";
import Modal from "./components/Modal";
import SuggestionModal from "./components/SuggestionModal";
import axios from "axios";
import Layout from "./components/layout";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],
      modal: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
      // Suggestions state
      suggestionList: [],
      suggestionModal: false,
      activeSuggestion: {
        title: "",
        description: "",
        resolved: false,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
    this.refreshSuggestions();
  }

  refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  refreshSuggestions = () => {
    axios
      .get("/api/suggestions/")
      .then((res) => this.setState({ suggestionList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item)
      .then((res) => this.refreshList());
  };

  // Suggestions handlers
  toggleSuggestion = () => {
    this.setState({ suggestionModal: !this.state.suggestionModal });
  };

  handleSuggestionSubmit = (item) => {
    this.toggleSuggestion();

    if (item.id) {
      axios
        .put(`/api/suggestions/${item.id}/`, item)
        .then(() => this.refreshSuggestions());
      return;
    }
    axios
      .post("/api/suggestions/", item)
      .then(() => this.refreshSuggestions());
  };

  handleSuggestionDelete = (item) => {
    axios
      .delete(`/api/suggestions/${item.id}/`)
      .then(() => this.refreshSuggestions());
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  createSuggestion = () => {
    const item = { title: "", description: "", resolved: false };
    this.setState({
      activeSuggestion: item,
      suggestionModal: !this.state.suggestionModal,
    });
  };

  editSuggestion = (item) => {
    this.setState({
      activeSuggestion: item,
      suggestionModal: !this.state.suggestionModal,
    });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  renderSuggestions = () => {
    return this.state.suggestionList.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`mr-2 ${item.resolved ? "text-decoration-line-through" : ""}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span> 
          <span className={`badge bg-${item.resolved ? "success" : "secondary"} mr-2`}>
           </span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editSuggestion(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleSuggestionDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
  return (
    <Layout>
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">
          Todo app
        </h1>

        <div className="row">
          {/* Todo */}
          <div className="col-md-6 col-sm-12 p-2">
            <div className="card p-3">
              <div className="mb-4">
                <button className="btn btn-primary" onClick={this.createItem}>
                  Suggesto! Add a task
                </button>
              </div>

              {this.renderTabList()}

              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
          {/* Suggestions */}
          <div className="col-md-6 col-sm-12 p-2">
            <div className="card p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h3 className="m-0">Suggestions</h3>
                <button
                  className="btn btn-primary"
                  onClick={this.createSuggestion}
                >
                  Add Suggestion
                </button>
              </div>

              <ul className="list-group list-group-flush border-top-0">
                {this.renderSuggestions()}
              </ul>
            </div>
          </div>
        </div>

        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}

        {this.state.suggestionModal ? (
          <SuggestionModal
            activeItem={this.state.activeSuggestion}
            toggle={this.toggleSuggestion}
            onSave={this.handleSuggestionSubmit}
          />
        ) : null}
      </main>
    </Layout>
  );
}
}

export default App;