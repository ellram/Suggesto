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
        resolved: false,
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
    this.setState({
      suggestionModal: !this.state.suggestionModal,
    });
  };

  toggleResolved = (item) => {
    axios
      .put(`/api/suggestions/${item.id}/`, {
        ...item,
        resolved: !item.resolved,
      })
      .then(() => this.refreshSuggestions());
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

  createSuggestion = () => {
    const item = {
      title: "",
      description: "",
      resolved: false,
    };

    this.setState({
      activeSuggestion: item,
      suggestionModal: true,
    });
  };

  editSuggestion = (item) => {
    this.setState({
      activeSuggestion: item,
      suggestionModal: true,
    });
  };

  renderSuggestions = () => {
    return this.state.suggestionList.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`mr-2 ${
            item.resolved ? "text-decoration-line-through" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>

        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editSuggestion(item)}
            style={{
                      background: "#E5E2FF",
                      color: "black",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontFamily: "Lora, serif",
                      cursor: "pointer",
                      padding: "6px 12px",
                      transition: "all 0.2s ease",
                      marginRight: "10px",
                    }}
          >
            Edit
          </button>

          <button
            className="btn btn-danger"
            onClick={() => this.handleSuggestionDelete(item)}
            style={{
                      background: "#E5E2FF",
                      color: "black",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontFamily: "Lora, serif",
                      cursor: "pointer",
                      padding: "6px 12px",
                      transition: "all 0.2s ease",
                      marginRight: "10px",
                    }}
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
            Suggestions
          </h1>

          <div className="row"
          style={{
            background: "#E5E2FF",
            color: "white",
            width: "flex",
            height: "flex",
            padding: "flex",
            fontFamily: "Lora, serif",
          }}>
            <div className="col-12 p-2">
              <div className="card p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="m-0">Nye forslag</h3>

                  <button
                    className="btn btn-primary"
                    onClick={this.createSuggestion}
                    style={{
                      background: "#E5E2FF",
                      color: "black",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontFamily: "Lora, serif",
                      cursor: "pointer",
                      padding: "6px 12px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Legg til forslag +
                  </button>
                </div>

                <ul className="list-group list-group-flush border-top-0">
                  {this.renderSuggestions()}
                </ul>
              </div>
            </div>
          </div>

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