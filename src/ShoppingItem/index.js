import React from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// form to hold the input field for a shopping item
class TitleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {item: props.item};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // user typed something, update the state
  handleChange(event) {
    const item = this.state.item;
    item.title = event.target.value;
    this.setState({item: item});
  }

  // user hit return key, tell backend to create or update the item
  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(event);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <input type="text" size="50" value={this.state.item.title} onChange={this.handleChange} />
      </form>
    );
  }
}

// the ShoppingItem containing a text field, 'bought' icon, 'delete' icon and draggable icon
class ShoppingItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {item: props.item};
  }

  handleSubmit = (event) => {
    if(this.state.item.id === 0) {
      global.apiClient.createItem(this.state.item).then((data) => {
        const item = this.state.item;
        item.id = data["id"];
        this.setState({item: item});
        // tell parent to add another shopping item
        this.props.onAdd();
      });
    } else {
      global.apiClient.updateItem(this.state.item);
    }
  }

  handleClickBought = (event) =>  {
    this.props.onBought(this.props.item)
  }

  handleClickDelete = (event) =>  {
    this.props.onDelete(this.props.item)
  }

  render() {
    return (
      <Box
        color="primary.main"
        bgcolor={this.props.item.id === 0 ? "pink" : "inherited"}
        borderColor="blue"
        border={0}
        p={{ xs: 0, sm: 0.5 }}
        display="flex"
      >
          <DragIndicatorIcon />
          <TitleForm onSubmit={this.handleSubmit} item={this.state.item} />
          <IconButton aria-label="bought" onClick={this.handleClickBought} style={{padding: "0 6px"}}>
            {this.state.item.bought === "0" || this.state.item.bought === "False" ? <RadioButtonUncheckedIcon /> : <CheckCircleIcon /> }
          </IconButton>
          <IconButton aria-label="delete" onClick={this.handleClickDelete} style={{padding: "0 6px"}}>
            <DeleteIcon />
          </IconButton>
      </Box>
    );
  }
}

export default ShoppingItem;