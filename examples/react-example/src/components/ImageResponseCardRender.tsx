import React from 'react';
import { Message } from '@aws-sdk/client-lex-runtime-v2';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

interface Props {
  message: Message;
  enabled: boolean;
  sendMessage: (message: string) => void;
}

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    background: '#444444',
    color: 'white',
  },
  media: {
    height: 140,
  },
  button: {
    margin: 5,
    background: '#222222',
    color: 'white',
  },
});

// Material UI based image response card render
const ImageResponseCardRender = ({
  message,
  enabled,
  sendMessage,
}: Props): React.ReactElement => {
  const classes = useStyles();
  if (message.imageResponseCard) {
    const { subtitle, imageUrl, title, buttons } = message.imageResponseCard;
    return (
      <Card className={classes.root}>
        <CardActionArea disabled={true}>
          {imageUrl && (
            <CardMedia
              className={classes.media}
              src={imageUrl}
              title="Contemplative Reptile"
            />
          )}
          <CardContent>
            {title && (
              <Typography gutterBottom variant="h5" component="h2">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="textSecondary" component="p">
                {subtitle}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
        <CardActions style={{ flexDirection: 'column' }}>
          {buttons?.map((button) => (
            <Button
              size="small"
              color="primary"
              className={classes.button}
              onClick={
                enabled ? () => sendMessage(button.value as string) : undefined
              }
            >
              {button.text}
            </Button>
          ))}
        </CardActions>
      </Card>
    );
  }
  return <></>;
};

export default ImageResponseCardRender;
