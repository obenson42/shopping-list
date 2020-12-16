import React from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// form to hold the input field for a shopping item
class TitleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.item.title};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // user typed something, update the state
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  // user hit return key
  handleSubmit(event) {
    this.props.item.title = event.target.value;
    global.apiClient.updateItem(this.props.item);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <input type="text" size="50" value={this.state.value} onChange={this.handleChange} />
      </form>
    );
  }
}

// the ShoppingItem containing a text field, 'bought' icon, 'delete' icon and draggable icon
class ShoppingItem extends React.Component {
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
        bgcolor="background.paper"
        borderColor="blue"
        border={1}
        p={{ xs: 0, sm: 1, md: 2 }}
        display="flex"
      >
          <DragIndicatorIcon />
          <TitleForm item={this.props.item} />
          <IconButton aria-label="bought" onClick={this.handleClickBought}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={this.handleClickDelete}>
            <DeleteIcon />
          </IconButton>
      </Box>
    );
  }
}

export default ShoppingItem;