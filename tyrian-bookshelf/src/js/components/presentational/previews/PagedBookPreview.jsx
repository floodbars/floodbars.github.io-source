import React from "react";
import ReactDOM from "react-dom";
import Page from "./Page.jsx"

class PagedBookPreview extends React.Component {
  render() {
    var book = this.props.book;
    if (!book) {
      return ("Uh-oh");
    }

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">{book.name}</h4>
          {book.text.map(page => (
            <Page page={page} key={page.page} />
          ))}
        </div>
      </div>
    );
  }
}

export default PagedBookPreview;