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
      filters: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
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

  render() {
    const { error, areBooksLoaded, areAchievementsLoaded, books, achievements, preview } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!areBooksLoaded || !areAchievementsLoaded) {
      return <div>Loading data...</div>;
    } else {
      return (
        <div>
          <h1>Tyrian Bookshelf</h1>
          <form onSubmit={this.handleSubmit}>
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
      );
    }
  }

  handleChange(e) {
    this.setState({ apiKey: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.apiKey.length) {
      return;
    }
    this.setState(state => ({
      apiKey: state.apiKey
    }));
    const repository = new BookRepository(this.state.books, this.state.achievements);
    ReactDOM.render(
      <Shelf apiKey={this.state.apiKey} repository={repository} />,
      document.getElementById('root')
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

export default Main;