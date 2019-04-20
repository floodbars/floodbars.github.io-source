import React from "react";
import ReactDOM from "react-dom";
import Preview from "./previews/Preview.jsx";
import Filter from "../forms/Filter.jsx";
import Book from "./Book.jsx";

class Shelf extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      achievements: [],
      isLoaded: false,
      error: null,
      selection: null,
      filters: {
        complete: true,
        partial: true,
        locked: true
      },
      showConfig: false
    };
  }
  componentDidMount() {
    if (this.props.apiKey == 'UNLOCK_ALL') {
      const allUnlocked = this.props.repository.generateCompleteProgress();
      this.setState({
        achievements: allUnlocked,
        isLoaded: true
      });
      return;
    } else if (this.props.apiKey == 'UNLOCK_NONE') {
      this.setState({
        achievements: [],
        isLoaded: true
      });
      return;
    } else if (this.props.apiKey == 'UNLOCK_SOME') {
      const someUnlocked = this.props.repository.generatePartialProgress();
      this.setState({
        achievements: someUnlocked,
        isLoaded: true
      });
      return;
    }
    // TODO wrap this in an API-centric class/module
    var url = "https://api.guildwars2.com/v2/account/achievements?"
      + "access_token=" + this.props.apiKey;
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            achievements: result,
            isLoaded: true
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  
  previewBook(book) {
    this.setState({
      selection: book
    });
  }

  _onSelectionChange(filterName, value) {
    var filterState = this.state.filters;
    filterState[filterName] = value;
    this.setState({
      filters: filterState
    });
  }

  _toggleConfiguration() {
    console.log("showConfig: " + !this.state.showConfig);
    this.setState({
      showConfig: !this.state.showConfig
    });
  }

  render() {
    const { error, isLoaded, achievements, selection, filters, showConfig } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading achievement progress...</div>;
    } else {
      var books = this.props.repository.mapAchievementsToBooks(achievements);
      books.sort((x, y) => x["name"].localeCompare(y["name"]));
      return (
        <div className="codex row h-100">
          <nav className="col-sm-4 h-100 p-0" style={{overflowY: "auto"}}>
            <nav class="navbar navbar-dark bg-primary sticky-top shadow mb-2">
              <a class="navbar-brand" href="#">Tyrian Bookshelf</a>
              <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => this._toggleConfiguration()}>
                &#9881;
              </button>
            </nav>
            <div className={"card bg-light border-primary m-4 p-3 " + (showConfig ? '' : 'collapse')} id="bookshelfConfig">
              <Filter
                filters={filters}
                onSelectionChange={this._onSelectionChange.bind(this)} />
            </div>
            <div className="list-group p-2">
              {books.map(book => (
                <Book
                  key={book.name}
                  activeBook={selection == null ? null : selection.name}
                  value={book}
                  onClick={() => this.previewBook(book)}
                  filters={filters} />
              ))}
            </div>
          </nav>
          <main className="col-sm-8 h-100 p-3" style={{overflowY: "auto"}}>
            <Preview book={selection} />
          </main>
        </div>
      );
    }
  }
}

export default Shelf;