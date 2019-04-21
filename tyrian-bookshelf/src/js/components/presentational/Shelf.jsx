import React from "react";
import ReactDOM from "react-dom";
import Preview from "./previews/Preview.jsx";
import Filter from "../forms/Filter.jsx";
import Book from "./Book.jsx";

class Shelf extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: null,
      filters: {
        complete: true,
        partial: true,
        locked: true
      },
      showConfig: false
    };

    this.configRef = React.createRef() 
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
    var newConfig = !this.state.showConfig;
    this.setState({
      showConfig: newConfig
    }, () => {
      if (newConfig) {
        this.configRef.current.scrollTop = 0;
      }
    });
  }

  render() {
    const { error, isLoaded, selection, filters, showConfig } = this.state;

    var books = this.props.repository.mapAchievementsToBooks(this.props.achievements);
    books.sort((x, y) => x["name"].localeCompare(y["name"]));

    return (
      <div className="codex row h-100">
        <nav id="pane-nav" className="col-sm-4 p-0 shadow-sm" style={{overflowY: "auto"}}
              ref={this.configRef}>
          <nav class="navbar navbar-dark bg-tyria sticky-top shadow mb-2">
            <a class="navbar-brand" href="#">Tyrian Bookshelf</a>
            <button
                className="btn btn-tyria"
                type="button"
                onClick={() => this._toggleConfiguration()}>
              &#9881;
            </button>
          </nav>
          <div className={"card bg-light border-tyria m-4-sm p-3-sm m-2 p-1 " + (showConfig ? '' : 'collapse')}
              id="bookshelfConfig">
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
        <main id="pane-main" className="col-sm-8 p-3" style={{overflowY: "auto"}}>
          <Preview book={selection} />
        </main>
      </div>
    );
  }
}

export default Shelf;