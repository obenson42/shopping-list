import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  choices: {
    minWidth: "100%",
    display: "flex",
} ,
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
  choice: {
    display: "flex",
    alignContent: "stretch",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  choiceTitle: {
    flexGrow: 9,
  },
  choicePrice: {
    flexGrow: 1,
    textAlign: "right",
  },
  price: {
    
  }
}));

export default function PriceChoice(props) {
  const classes = useStyles();

  const handleChange = (event) => {
    props.onSelect(event);
  };

  return (
    <div className={classes.choices}>
      <FormControl className={classes.formControl}>
        <Select
          id={"item-" + 0}
          value={0}
          onChange={handleChange}
          labelId={"PriceChoice-" + props.id}
          displayEmpty
        >
          <MenuItem key={"PriceChoice-0"} value={0} className={classes.choice}>
            {props.title}
          </MenuItem>
          {props.choices.map((item, index) => (
            <MenuItem key={"PriceChoice-" + item.id} value={item.id} className={classes.choice}>
              <div className={classes.choiceTitle}>{item.title}</div>
              <div className={classes.choicePrice}>{"£" + item.price.toFixed(2)}</div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
