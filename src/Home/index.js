import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Book from "../Book"
import Author from "../Author"

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
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      books: [],
      authors: [],
      publishers: [],
      editions: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const books = reorder(
      this.state.books,
      result.source.index,
      result.destination.index
    );

    this.setState({
      books
    });
  }

  async componentDidMount() {
    this.loadBooks();
  }

  loadBooks() {
    global.apiClient.getBooks().then((data) =>
      this.setState({...this.state, books: data["books"]})
    );
  }

  loadAuthors() {
    global.apiClient.getAuthors().then((data) =>
      this.setState({...this.state, authors: data["authors"]})
    );
  }

  loadPublishers() {
    global.apiClient.getPublishers().then((data) =>
      this.setState({...this.state, publishers: data["publishers"]})
    );
  }

  handleTabChange = (event, value) => {
    this.setState({ value });
    switch(value) {
      case 0:
        this.loadBooks();
        break;
      case 1:
        this.loadAuthors();
        break;
      case 2:
        this.loadPublishers();
        break;
      default:
    }
  };

  handleTabChangeIndex = index => {
    this.setState({ value: index });
  };

  resetBooks = books => this.setState({ ...this.state, books })
  
  renderBooks = (books) => {
    if (!books) { return [] }
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {this.state.books.map((item, index) => (
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
                    <Book onBook={this.onBook} book={item} />
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
  

  resetAuthors = authors => this.setState({ ...this.state, authors })
  
  renderAuthors = (authors) => {
    if (!authors) { return [] }
    return authors.map((author) => {
      return (
        <Grid item xs={12} md={3} key={author.id}>
          <Author onAuthor={this.onAuthor} author={author} />
        </Grid>
      );
    })
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
          <Tab label="Books" />
          <Tab label="Authors" />
          <Tab label="Publishers" />
        </Tabs>
      
          <Grid container style={{padding: '20px 0'}}>
            { this.state.value === 0 ? this.renderBooks(this.state.books) : null }
            { this.state.value === 1 ? this.renderAuthors(this.state.authors) : null }
            { this.state.value === 2 ? this.renderBooks(this.state.publishers) : null }
          </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Home);