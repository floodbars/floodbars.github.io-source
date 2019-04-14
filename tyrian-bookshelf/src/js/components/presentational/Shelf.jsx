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
      preview: null,
      filters: {
        complete: true,
        partial: true,
        locked: true
      }
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
      preview: book
    });
  }

  _onSelectionChange(filterName, value) {
    var filterState = this.state.filters;
    filterState[filterName] = value;
    this.setState({
      filters: filterState
    });
  }

  render() {
    const { error, isLoaded, achievements, preview, filters } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading achievement progress...</div>;
    } else {
      var books = this.props.repository.mapAchievementsToBooks(achievements);
      books.sort((x, y) => x["name"].localeCompare(y["name"]));
      return (
        <div className="codex container-fluid h-100">
          <div className="row">
            <h2>Tyrian Bookshelf</h2>
          </div>
          <div className="row" style={{height: "90%"}}>
            <div className="col-sm-4 h-100" style={{overflowY: "auto"}}>
              <Filter filters={filters} onSelectionChange={this._onSelectionChange.bind(this)} />
              <div className="list-group">
                {books.map(book => (
                  <Book key={book.name} value={book} onClick={() => this.previewBook(book)} filters={filters} />
                ))}
              </div>
            </div>
            <div className="col-sm-8 h-100" style={{overflowY: "auto"}}>
              <Preview book={preview} />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Shelf;