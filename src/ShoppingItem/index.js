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
    console.log("c:" + this.props.item.id + ":" + this.props.item.title);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // user typed something, update the state
  handleChange(event) {
    const item = this.state.item;
    item.title = event.target.value;
    this.setState({item: item});
//    this.props.item.title = event.target.value; // update the connected item too
  }

  // user hit return key, tell backend to create or update the item
  handleSubmit(event) {
    event.preventDefault();
    if(this.state.item.id === 0) {
      global.apiClient.createItem(this.state.item).then((data) => {
        this.props.onUpdateID(data["id"]);
      });
    } else {
      global.apiClient.updateItem(this.state.item);
    }
  }

  render() {
    console.log("r:" + this.state.item.id + ":" + this.state.item.title);
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
    this.state = {value: props.item.id};
  }

  handleIDChange = (id) => {
    this.props.item.id = id;
    this.setState({value: this.props.item.id});
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
        bgcolor={this.props.item.id === 0 ? "pink" : "background.paper"}
        borderColor="blue"
        border={1}
        p={{ xs: 0, sm: 1, md: 2 }}
        display="flex"
      >
          <DragIndicatorIcon />
          <TitleForm onUpdateID={this.handleIDChange} item={this.props.item} />
          <IconButton aria-label="bought" onClick={this.handleClickBought}>
            {this.props.item.bought === "0" || this.props.item.bought === "False" ? <RadioButtonUncheckedIcon /> : <CheckCircleIcon /> }
          </IconButton>
          <IconButton aria-label="delete" onClick={this.handleClickDelete}>
            <DeleteIcon />
          </IconButton>
      </Box>
    );
  }
}

export default ShoppingItem;