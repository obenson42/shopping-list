import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import TitleOrChoice from './TitleOrChoice'

// the ShoppingItem containing a text field, 'bought' icon, 'delete' icon and draggable icon
export default function ShoppingItem(props) {
  const item = props.item;
  const [price, setPrice] = useState(0.0);
  const [productChoices, setProductChoices] = useState([]);
  
  useEffect(() => {
    if(item && item.title && !price && (productChoices.length === 0)) { // price and productChoices tests ensure it doesn't get called once there's been a response
      global.apiTescoPrices.getItemPrice(item.title).then(response => {
        if(typeof(response) === "number") {
          setPrice(response);
          props.onPriced(item, parseFloat(response));
        } else {
          if(response.length > 1) {
            setProductChoices(response);
          }
        }
      })
      .catch(error => {
        console.log("Error: " + error);
      });
    }
  });

  const handleTitleSet = (title) => {
    item.title = title;
    if(item.id === 0) {
      global.apiClient.createItem(item).then((data) => {
        item.id = data["id"];
        // tell parent to add another shopping item
        props.onAdd();
      });
    } else {
      global.apiClient.updateItem(item);
    }
  }

  const handleClickBought = (event) =>  {
    props.onBought(props.item)
  }

  const handleClickDelete = (event) =>  {
    props.onDelete(props.item)
  }

  const handlePriced = (price) => {
    props.onPriced(item, price);
  }

  return (
    <Box
      color="primary.main"
      bgcolor={item.id === 0 ? "pink" : "inherited"}
      border={0}
      p={{ xs: 0, sm: 0.5 }}
      display="flex"
    >
        <DragIndicatorIcon />
        <TitleOrChoice id={item.id} title={item.title} price={price} productChoices={productChoices} onTitleSet={handleTitleSet} onSetPrice={handlePriced} />
        <IconButton aria-label="bought" onClick={handleClickBought} style={{padding: "0 6px"}}>
          {item.bought === 0 ? <RadioButtonUncheckedIcon /> : <CheckCircleIcon /> }
        </IconButton>
        <IconButton aria-label="delete" onClick={handleClickDelete} style={{padding: "0 6px"}}>
          <DeleteIcon />
        </IconButton>
    </Box>
  );
}
