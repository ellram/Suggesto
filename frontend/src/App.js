import React, { Component } from "react";
import SuggestionModal from "./components/SuggestionModal";
import axios from "axios"; //dette er HTTP klienten for å gjøre API kallene, bruker axios som js bibliotek 
import Layout from "./components/layout";
import "./App.css";

//hovedkomponent for hele applikasjonen
class App extends Component {
  constructor(props) {
    super(props);

    //lokal state for komponenten
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

  //automatisk kalles når komponenten er ferdig lastet
  componentDidMount() {
    this.refreshSuggestions();
  }

  //denne henter alle forslagene fra backend
  refreshSuggestions = () => {
    axios
      .get("/api/suggestions/")
      .then((res) => this.setState({ suggestionList: res.data }))
      .catch((err) => console.log(err));
  };

  //åpner og lukker modal for oppretting og migrering 
  toggleSuggestion = () => {
    this.setState((prev) => ({
      suggestionModal: !prev.suggestionModal,
    }));
  };

  //Her oppdaterer vi status på et forslag
  setStatus = (item, status) => {
    axios
      .put(`/api/suggestions/${item.id}/`, {
        ...item,
        status,
      })
      .then(() => this.refreshSuggestions());
  };

  //denne hånterer lagring av forslagene (så opprette eller oppdater, hadde lagt til sletting om jeg hadde tid)
  handleSuggestionSubmit = (item) => {
    this.toggleSuggestion();
    //hvis item har id → oppdater eksisterende, ellers opprett nytt
    const request = item.id
      ? axios.put(`/api/suggestions/${item.id}/`, item)
      : axios.post("/api/suggestions/", item);

    request.then(() => this.refreshSuggestions());
  };

  //denne er lagt in for å kunne slette forslagene, jeg har ikke implementert dette ennp
  handleSuggestionDelete = (item) => {
    axios
      .delete(`/api/suggestions/${item.id}/`)
      .then(() => this.refreshSuggestions());
  };

  //state for å kunne lage et nyttforslag 
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

  //denne er for å kunne redigere på forslaget
  editSuggestion = (item) => {
    this.setState({
      activeSuggestion: item,
      suggestionModal: true,
    });
  };

//rendrer ett enkelt forslag her et liste-element
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

  //filtreringer for å kunne bruke i ulike kolonner her
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

  //her skjer UI
  render() {
    return (
      <Layout>
        <main className="container">
          <h1 className="text-white text-uppercase text-center my-4">
            Suggestions
          </h1>
          {/* Kolonner for ulike statuser */}
          <div className="row g-3">
            {/* Nye forslag */}
            <div className="col-12 col-md-4 suggestion-column">
              <div id="new-suggestions" className="card suggestion-card"
                style={{
                  backgroundColor: "#E5E2FF",
                }}
              >
                <div className="suggestion-header">
                  <h3 className="suggestion-title">Nye forslag</h3>

                  {/* Knapp for å opprette nytt forslag */}
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

            {/* Godkjente forslag */}
            <div className="col-12 col-md-4 suggestion-column">
              <div className="card suggestion-card"
                style={{
                  backgroundColor: "#CAFFED",
                }}
              >
                <div className="suggestion-header">
                  <h3 className="suggestion-title">Godkjente forslag</h3>
                </div>
                <ul className="list-group list-group-flush suggestion-list">
                  {this.renderApprovedSuggestions()}
                </ul>
              </div>
            </div>

            {/* Avviste forslag */}
            <div className="col-12 col-md-4 suggestion-column">
              <div className="card suggestion-card"
                style={{
                  backgroundColor: "#FFC0C0",
                }}
              >
                <div className="suggestion-header">
                  <h3 className="suggestion-title">Avvist</h3>
                </div>

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