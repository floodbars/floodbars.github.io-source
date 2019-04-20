import React from "react";
import ReactDOM from "react-dom";
import BookHint from "./BookHint.jsx";

class LockedBookPreview extends React.Component {
  getHint() {
    var book = this.props.book;
    if (book.type == "paged" || book.type == "book-paged") {
      var achievements = new Set(book.text.filter(function(page) {
        return !page.isUnlocked 
      }).map(page => page.achievement));
      if (achievements.size == 1) {
        var achievement = achievements.values().next().value;
        if (achievement != null) {
          return achievement.name;
        }
      }
    } else if (book.achievement) {
      return book.achievement.name;
    }
    return book.name;
  }

  render() {
    var book = this.props.book;
    var hintName = this.getHint();
    return (
      <div className="card border-0">
        <div className="preview card-body p-0">
          <h4 className="card-title">{book.name}
            <span className="badge badge-warning ml-2">
              Missing
            </span>
          </h4>
          <BookHint value={hintName} />
          <div className="bd-callout bd-callout-warning text-secondary p-2 p-sm-3">
            You have yet to acquire this book.
          </div>
        </div>
      </div>
    );
  }

}

export default LockedBookPreview;