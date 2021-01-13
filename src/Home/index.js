import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
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
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "white",
  padding: 1
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabindex: 0,
      items: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onPriced = this.onPriced.bind(this);
  }

  resetItems = items => {
    this.setState({ ...this.state, items: items });
    this.updateListTotal();
  }

  updateListTotal() {
    let total = 0.0;
    
    const items = this.state.items;
    for(let i = 0; i < items.length; i++) {
      let item = items[i];
      //console.log("price=" + item.price);
      total += item.price ? item.price : 0;
    }
    if(document.getElementById("tabItems"))
      document.getElementById("tabItems").firstChild.textContent = "Items (total: £" + total.toFixed(2) + ")";
  }

  onPriced(itemPriced, price) {
    const items = this.state.items;
    for(let i = 0; i < items.length; i++) {
      let item = items[i];
      if(item.id === itemPriced.id) {
        item.price = price;
        break;
      }
    }
    this.updateListTotal();
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

    this.resetItems(items);

    // tell the back end that an item has been moved (back end will update multiple item positions)
    const item = this.state.items[result.source.index];
    item.position = result.destination.index;
    // if item hasn't been saved yet send it to the backend
    if (item.id === 0) {
      global.apiClient.createItem(item).then((data) => {
        item.id = data["id"]; // update the item with its new id
        global.apiClient.reorderItems(item);
        this.resetItems(items);
      });
    } else {
      global.apiClient.reorderItems(item);
    }
  }

  async componentDidMount() {
    // start with the list of existing items
    this.loadItems();
  }

  // load any existing items from the user's shopping list
  loadItems() {
    global.apiClient.getItems().then((data) => 
      this.resetItems(data["shopping_items"])
    );
  }

  // the tab stuff does nothing useful here
  handleTabChange = (event, tabindex) => {
    this.setState({ ...this.state, tabindex: tabindex });
    switch(tabindex) {
      case 0:
        this.loadItems();
        break;
      default:
    }
  };

  handleTabChangeIndex = index => {
    this.setState({ tabindex: index });
  };

  // user clicked the icon to add another item
  handleClickAdd = (event) => {
    this.addNewItem();
  }

  onAdd = () => {
    const items = this.state.items;
    this.resetItems(items);
    this.addNewItem();
  }

  addNewItem() {
    const items = this.state.items;
    const position = items.length > 0 ? items[items.length-1].position + 1 : 0;
    const newItem = { id: 0, title:"", bought:0, position:position };
    if(items.length > 0) {
      const item = items[items.length-1];
      if(item.id === 0) {
        // previous item hasn't been sent to back end so do that, then add the new item to the state
        global.apiClient.createItem(item).then((data) => {
          item.id = data["id"]; // update the item with its new id
          this.resetItems(items);
          // add the new item to the state
          items.push(newItem);
          this.resetItems(items);
        });
      } else {
        // add the new item to the state
        items.push(newItem);
        this.resetItems(items);
      }
    } else {
      // add the new item to the state
      items.push(newItem);
      this.resetItems(items);
    }
  }

  // user clicked the bought icon on an item, tell the backend (if it has an id)
  onBought = (item) => {
    const items = this.state.items;
    item = items.find(i => i.id===item.id);
    item.bought = item.bought === 0 ? 1 : 0; // toggle it
    if (item.id !== 0)
      global.apiClient.updateItem(item);
      this.resetItems(items);
  }

  // user clicked the delete icon on an item, remove it from the items array and tell the backend (if it has an id)
  onDelete = (item) => {
    if (item.id !== 0)
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
                    <ShoppingItem onBought={this.onBought} onDelete={this.onDelete} onAdd={this.onAdd} onPriced={this.onPriced} item={item} />
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
      <div className={styles.root} style={{textAlign: 'center'}}>
        <Tabs
          value={this.state.tabindex}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Items" id="tabItems"/>
        </Tabs>
      
          <Grid container style={{padding: '20px 0 0 0', justifyContent: 'center'}}>
            {this.renderItems(this.state.items)}
          </Grid>
          <IconButton aria-label="add item" onClick={this.handleClickAdd} style={{textAlign: 'center'}}>
            <AddCircleOutlineIcon />
          </IconButton>
      </div>
    );
  }
}

export default withStyles(styles)(Home);