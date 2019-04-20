import React from "react";
import ReactDOM from "react-dom";
import Page from "./Page.jsx"
import BookHint from "./BookHint.jsx";

class PagedBookPreview extends React.Component {
  render() {
    var book = this.props.book;
    if (!book) {
      return ("Uh-oh");
    }

    var achievements = new Set(book.text.filter(function(page) {
      return !page.isUnlocked 
    }).map(page => page.achievement));
    var hasBookLevelHint = achievements.size == 1;
    return (
      <div className="card border-0">
        <div className="card-body p-0">
          <h4 className="card-title">{book.name}</h4>
          {hasBookLevelHint &&
            <BookHint value={achievements.values().next().value.name} />
          }
          {book.text.map(page => (
            <Page page={page} key={page.page} hideHint={hasBookLevelHint} />
          ))}
        </div>
      </div>
    );
  }
}

export default PagedBookPreview;