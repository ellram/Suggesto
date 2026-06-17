import React, { Component } from "react";
import SuggestionModal from "./components/SuggestionModal";
import axios from "axios";
import Layout from "./components/layout";
import "./App.css";

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
    <li key={item.id} className="list-group-item suggestion-item">
      <div className="suggestion-text" title={item.description}>
        {item.title}
      </div>

      <div className="suggestion-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => this.editSuggestion(item)}
        >
          Edit
        </button>

        <button
          className="btn btn-success btn-sm"
          onClick={() => this.setStatus(item, "approved")}
        >
          Godkjenn
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => this.setStatus(item, "rejected")}
        >
          Avvis
        </button>
      </div>
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
          <div className="row g-3">
            <div className="col-12 col-md-4 suggestion-column">
              <div className="card suggestion-card"
                style={{
                  backgroundColor: "#E5E2FF",
                }}
              >
                <div className="suggestion-header">
                  <h3 className="suggestion-title">Nye forslag</h3>

                  <button
                    className="btn btn-primary"
                    onClick={this.createSuggestion}
                    style={{
                      fontSize: "12px",
                      border: "none",
                      backgroundColor: "#9f92ff",
                    }}
                  >
                    +
                  </button>
                </div>

                <ul className="list-group list-group-flush suggestion-list">
                  {this.renderNewSuggestions()}
                </ul>
              </div>
            </div>

            <div className="col-12 col-md-4 suggestion-column">
              <div className="card suggestion-card"
                style={{
                  backgroundColor: "#CAFFED",
                }}
              >
                <h3 className="suggestion-title">Godkjente forslag</h3>
                <ul className="list-group list-group-flush suggestion-list">
                  {this.renderApprovedSuggestions()}
                </ul>
              </div>
            </div>

            <div className="col-12 col-md-4 suggestion-column">
              <div className="card suggestion-card"
                style={{
                  backgroundColor: "#FFC0C0",
                }}
              >
                <h3 className="suggestion-title">Avvist</h3>

                <ul className="list-group list-group-flush suggestion-list">
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