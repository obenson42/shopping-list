import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ShoppingItem from "../ShoppingItem"

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 0,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "background.paper",
  padding: 1,
  width: 600
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      items: []    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    // reorder the items in the front end
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });

    // tell the back end that an item has been moved (back end will update multiple item positions)
    const item = this.state.items[result.source.index];
    item.position = result.destination.index;
    global.apiClient.reorderItems(item);
  }

  async componentDidMount() {
    // start with the list of existing items
    this.loadItems();
  }

    // load any existing items from the user's shopping list
    loadItems() {
    global.apiClient.getItems().then((data) =>
      this.setState({...this.state, items: data["shopping_items"]})
    );
  }

  handleTabChange = (event, value) => {
    this.setState({ value });
    switch(value) {
      case 0:
        this.loadItems();
        break;
      default:
    }
  };

  handleTabChangeIndex = index => {
    this.setState({ value: index });
  };

  resetItems = items => this.setState({ ...this.state, items })

  // user clicked the bought icon on an item, tell the backend
  onBought = (item) => {
    item.bought = item.bought === 0 ? 1 : 0; // toggle it
    global.apiClient.updateItem(item);
  }

  // user clicked the delete icon on an item, remove it from the items array and tell the backend
  onDelete = (item) => {
    global.apiClient.deleteItem(item);
    this.setState({
      ...this.state,
      items: this.state.items.filter( i => i.id !== item.id )
    })
}

  // using react-beautiful-dnd to enable reordering of the list
  // this provides DragDropContext, Droppable and Draggable
  renderItems = (items) => {
    if (!items) { return [] }
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {this.state.items.map((item, index) => (
              <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <ShoppingItem onBought={this.onBought} onDelete={this.onDelete} item={item} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    );
  }
  

  render() {
    return (
      <div className={styles.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Items" />
        </Tabs>
      
          <Grid container style={{padding: '20px 0'}}>
            { this.state.value === 0 ? this.renderItems(this.state.items) : null }
          </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Home);