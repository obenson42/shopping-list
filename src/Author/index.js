import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  }
});

class Author extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          title={this.props.author.first_name + " " + this.props.author.surname}
        />
        <CardContent>
          <Typography component="p" style={{minHeight: '60px'}}>
            {"Born " + this.props.author.date_birth}
          </Typography>
          <IconButton aria-label="delete" onClick={this.handleClick}>
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Author);