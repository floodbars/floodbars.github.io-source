import React from "react";
import ReactDOM from "react-dom";

class LockedBookPreview extends React.Component {

  render() {
    var book = this.props.book;
    return (
      <div className="card border-warning">
        <div className="card-body text-warning">
          <h4 className="card-title">{book.name}</h4>
          You have yet to acquire this book.
        </div>
      </div>
    );
  }

}

export default LockedBookPreview;