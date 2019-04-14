import React from "react";
import ReactDOM from "react-dom";

class BookPreview extends React.Component {
  render() {
    const book = this.props.value;
    return (
      <div className="card">
        <div className="preview card-body">
          <h4 className="card-title">{book.name}</h4>
          {book.text.split("\n").map((paragraph, index) => (
            <p key={"p-" + index}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  }
}

export default BookPreview;