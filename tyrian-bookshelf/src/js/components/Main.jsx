import React from "react";
import ReactDOM from "react-dom";
import BookRepository from "./BookRepository.jsx";
import Shelf from "./presentational/Shelf.jsx";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: 'UNLOCK_ALL',
      areBooksLoaded: false,
      books: null,
      areAchievementsLoaded: false,
      achievements: null,
      repository: null,
      filters: {},
      areAccountAchievementsLoaded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadAchievements();
    this.loadBooks();
  }

  loadAchievements() {
    fetch("https://floodbars.github.io/gw2/data/bookshelf-achievements.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            errors: this.state.errors,
            achievements: result,
            areAchievementsLoaded: true
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            areAchievementsLoaded: true,
            books: this.state.books,
            areBooksLoaded: this.state.areBooksLoaded,
            error
          });
        }
      )
  }

  loadBooks() {
    fetch("https://floodbars.github.io/gw2/data/bookshelf-books.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            errors: this.state.errors,
            books: result,
            areBooksLoaded: true
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            areBooksLoaded: true,
            achievements: this.state.achievements,
            areAchievementsLoaded: this.state.areAchievementsLoaded,
            error
          });
        }
      )
  }

  loadAccountAchievements() {
    const repository = new BookRepository(this.state.books, this.state.achievements);
    this.setState({
      repository: repository
    });

    if (this.state.apiKey == 'UNLOCK_ALL') {
      const allUnlocked = repository.generateCompleteProgress();
      this.setState({
        achievements: allUnlocked,
        areAccountAchievementsLoaded: true
      });
      return;
    } else if (this.state.apiKey == 'UNLOCK_NONE') {
      this.setState({
        achievements: [],
        areAccountAchievementsLoaded: true
      });
      return;
    } else if (this.state.apiKey == 'UNLOCK_SOME') {
      const someUnlocked = repository.generatePartialProgress();
      this.setState({
        achievements: someUnlocked,
        areAccountAchievementsLoaded: true
      });
      return;
    }
    // TODO wrap this in an API-centric class/module
    var url = "https://api.guildwars2.com/v2/account/achievements?"
      + "access_token=" + this.state.apiKey;
    fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status == 403) {
            throw new Error("Please supply a valid API key with 'progression' scope")
          } else {
            // TODO not sure how to properly expose promises.
            throw new Error(res.text());
          }
        }
      })
      .then(
        (result) => {
          this.setState({
            achievements: result,
            areAccountAchievementsLoaded: true
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            error
          });
        }
      );
  }

  render() {
    const { error, areBooksLoaded, areAchievementsLoaded, books, achievements, repository, preview, areAccountAchievementsLoaded } = this.state;
    if (areAccountAchievementsLoaded) {
      ReactDOM.render(
        <Shelf achievements={achievements} repository={repository} />,
        document.getElementById('root')
      );
      return null;
    }

    var interjection = null;
    if (error) {
      interjection = <div className="alert alert-danger m-4"><b>Error</b>: {error.message}</div>;
    } else if (!areBooksLoaded || !areAchievementsLoaded) {
      interjection = <div className="alert alert-info m-4">Loading data...</div>;
    }

    return (
      <div className="row">
        <div className="col p-0">
          <nav class="navbar navbar-dark bg-primary sticky-top shadow mb-2">
            <a class="navbar-brand" href="#">Tyrian Bookshelf</a>
          </nav>
          {interjection}
          <form onSubmit={this.handleSubmit} className="p-2">
            <div className="form-group">
            <label htmlFor="api-key">
              API Key
            </label>
            <input
              id="api-key"
              className="form-control"
              onChange={this.handleChange}
              value={this.state.apiKey}
            />
            </div>
            <button type="submit" className="btn btn-primary">
              Load
            </button>
          </form>
        </div>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ apiKey: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.apiKey.length) {
      return;
    }

    this.loadAccountAchievements();
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

export default Main;