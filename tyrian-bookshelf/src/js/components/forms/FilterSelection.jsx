import React from "react";
import ReactDOM from "react-dom";

class FilterSelection extends React.Component {
  handleChange(event) {
    this.props.onChange(event.target.checked);
  }

  render() {
    return (
      <label className={ "btn form-check-inline btn-outline-tyria btn-sm mb-1 " + (this.props.isChecked ? 'active' : 'disabled') }>
        <input
          type="checkbox"
          checked={this.props.isChecked}
          onChange={this.handleChange.bind(this)}
          autoComplete="off" /> {this.props.name}
      </label>
    );
  }
}

export default FilterSelection;