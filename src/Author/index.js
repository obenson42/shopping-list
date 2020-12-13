import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  palette: {
    primary: blue,
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
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Author);