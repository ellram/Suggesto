import React, { Component } from "react";
import SuggestionModal from "./components/SuggestionModal";
import axios from "axios";
import Layout from "./components/layout";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestionList: [],
      suggestionModal: false,
      activeSuggestion: {
        title: "",
        description: "",
        status: "new",
      },
    };
  }

  componentDidMount() {
    this.refreshSuggestions();
  }

  refreshSuggestions = () => {
    axios
      .get("/api/suggestions/")
      .then((res) => this.setState({ suggestionList: res.data }))
      .catch((err) => console.log(err));
  };

  toggleSuggestion = () => {
    this.setState((prev) => ({
      suggestionModal: !prev.suggestionModal,
    }));
  };

  setStatus = (item, status) => {
    axios
      .put(`/api/suggestions/${item.id}/`, {
        ...item,
        status,
      })
      .then(() => this.refreshSuggestions());
  };

  handleSuggestionSubmit = (item) => {
    this.toggleSuggestion();

    const request = item.id
      ? axios.put(`/api/suggestions/${item.id}/`, item)
      : axios.post("/api/suggestions/", item);

    request.then(() => this.refreshSuggestions());
  };

  handleSuggestionDelete = (item) => {
    axios
      .delete(`/api/suggestions/${item.id}/`)
      .then(() => this.refreshSuggestions());
  };

  createSuggestion = () => {
    this.setState({
      activeSuggestion: {
        title: "",
        description: "",
        status: "new",
      },
      suggestionModal: true,
    });
  };

  editSuggestion = (item) => {
    this.setState({
      activeSuggestion: item,
      suggestionModal: true,
    });
  };

  renderItem = (item) => {
    return (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span title={item.description}>{item.title}</span>

        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editSuggestion(item)}
          >
            Edit
          </button>

          <button
            className="btn btn-success mr-2"
            onClick={() => this.setStatus(item, "approved")}
          >
            Godkjenn
          </button>

          <button
            className="btn btn-danger"
            onClick={() => this.setStatus(item, "rejected")}
          >
            Avvis
          </button>
        </span>
      </li>
    );
  };

  renderNewSuggestions = () =>
    this.state.suggestionList
      .filter((item) => item.status === "new")
      .map((item) => this.renderItem(item));

  renderApprovedSuggestions = () =>
    this.state.suggestionList
      .filter((item) => item.status === "approved")
      .map((item) => this.renderItem(item));

  renderRejectedSuggestions = () =>
    this.state.suggestionList
      .filter((item) => item.status === "rejected")
      .map((item) => this.renderItem(item));

  render() {
    return (
      <Layout>
        <main className="container">
          <h1 className="text-white text-uppercase text-center my-4">
            Suggestions
          </h1>

          {/* NYE FORSLAG */}
          <div className="row">
            <div className="col-12 p-2">
              <div className="card p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="m-0">Nye forslag</h3>

                  <button
                    className="btn btn-primary"
                    onClick={this.createSuggestion}
                  >
                    Legg til forslag +
                  </button>
                </div>

                <ul className="list-group list-group-flush border-top-0">
                  {this.renderNewSuggestions()}
                </ul>
              </div>
            </div>
          </div>

          {/* GODKJENTE */}
          <div className="row mt-4">
            <div className="col-12 p-2">
              <div className="card p-3">
                <h3>Godkjente forslag</h3>

                <ul className="list-group list-group-flush border-top-0">
                  {this.renderApprovedSuggestions()}
                </ul>
              </div>
            </div>
          </div>

          {/* AVVIST */}
          <div className="row mt-4">
            <div className="col-12 p-2">
              <div className="card p-3">
                <h3>Avvist</h3>

                <ul className="list-group list-group-flush border-top-0">
                  {this.renderRejectedSuggestions()}
                </ul>
              </div>
            </div>
          </div>

          {this.state.suggestionModal && (
            <SuggestionModal
              activeItem={this.state.activeSuggestion}
              toggle={this.toggleSuggestion}
              onSave={this.handleSuggestionSubmit}
            />
          )}
        </main>
      </Layout>
    );
  }
}

export default App;