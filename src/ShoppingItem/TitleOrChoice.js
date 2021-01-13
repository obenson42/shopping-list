import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PriceChoice from './PriceChoice.js'

const useStyles = makeStyles((theme) => ({
    line: {
        minWidth: "100%",
        display: "flex",
    },
    price: {
        paddingLeft: "1rem",
        paddingRight: "0.5rem",
        color: "black",
        fontWeight: "bold",
    },
}));
  
// form to hold the input field for a shopping item
function TitleForm(props) {
    const [title, setTitle] = useState(props.title);

    // user typed something, update the state
    const handleChange = (event) => {
        setTitle(event.target.value);
    }

    // user hit return key, tell backend to create or update the item
    const handleSubmit = (event) => {
        event.preventDefault();
        props.onTitleSet(title);
    }

    return (
        <form onSubmit={handleSubmit} className='itemTextForm'>
            <TextField value={title}
            onChange={handleChange}
            fullWidth={true}
            autoFocus={true}
            inputProps={{ 'aria-label': 'an item to be bought' }}
            />
        </form>
    );
}

export default function TitleOrChoice(props) {
    const classes = useStyles();
    const [title, setTitle] = useState(props.title);
    const [price, setPrice] = useState(props.price);
    const [productChoices, setProductChoices] = useState([]);

    useEffect(() => {
        setPrice(props.price);
        setProductChoices([...props.productChoices]);
    }, [props.price, props.productChoices]);

    const handleTitleSet = (title) => {
        setTitle(title);
        props.onTitleSet(title);
    }

    const handleSelect = (event) => {
        const newID = event.target.value;
        let selectedItem = null;
        for(let i = 0; i < productChoices.length; i++) {
            if(productChoices[i]["id"] === newID) {
                selectedItem = productChoices[i];
                setTitle(selectedItem["title"]);
                setPrice(selectedItem["price"]);
                setProductChoices([]);
                props.onOptionChosen(selectedItem["title"], selectedItem["price"]);
                break;
            }
        }
    }

    if(productChoices.length < 1) {
        return (
        <div className={classes.line}>
            <TitleForm onTitleSet={handleTitleSet} title={title} />
            <div className={classes.price}>£{parseFloat(price, 10).toFixed(2)}</div>
        </div>
        );
    } else {
        return (
        <PriceChoice id={props.id} title={title} price={price} choices={productChoices} onSelect={handleSelect} />
        );
    }
}
