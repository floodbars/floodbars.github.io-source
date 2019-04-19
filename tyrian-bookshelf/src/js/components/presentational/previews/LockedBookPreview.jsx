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
      <div className="card border-warning">
        <div className="card-body text-warning">
          <h4 className="card-title">{book.name}</h4>
          You have yet to acquire this book.
          <BookHint value={hintName} />
        </div>
      </div>
    );
  }

}

export default LockedBookPreview;