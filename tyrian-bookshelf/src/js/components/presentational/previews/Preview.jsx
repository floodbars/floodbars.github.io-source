import React from "react";
import ReactDOM from "react-dom";
import LockedBookPreview from "./LockedBookPreview.jsx";
import PagedBookPreview from "./PagedBookPreview.jsx";
import BookPreview from "./BookPreview.jsx";

class Preview extends React.Component {
  render() {
    var book = this.props.book;
    if (!book) {
      return ( 
        <div className="card">
          <div className="card-body text-secondary">
            No book selected to preview.
          </div>
        </div>
      );
    }

    if (book.status == "locked") {
      return (
        <LockedBookPreview book={book} />
      );
    }

    if (book.type == "paged" || book.type == "book-paged") {
      return (
        <PagedBookPreview book={book} />
      );
    } else {
      return (
        <BookPreview value={book} />
      );
    }
  }
}

export default Preview;