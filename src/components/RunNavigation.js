import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import config from './config';
import {processStartNav} from '../Utils/util';

function SimpleDialog(props) {
  const { onClose, selectedValue, open, maps} = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle style={{ fontSize: '30px' }} >Select the map you want to run</DialogTitle>
      <List sx={{ pt: 0 }}>
        {maps?.map((mapName) => (
          <ListItem button onClick={() => handleListItemClick(mapName)} key={mapName}>
            <ListItemText primary={"* " + mapName} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  maps: PropTypes.array.isRequired,
};

const RunNavigation = ({ payloadWsGeneric , maps}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
    setSelectedValue()
  };

  const handleClose = (value) => {
    setOpen(false);

    if ("" != value){

        var splitted_data = value?.split('_');
        if (!splitted_data) {
          return;
        }

        payloadWsGeneric(config.StartNav, processStartNav(splitted_data[0] , splitted_data[1]))
    }

    setSelectedValue(value);
  };

  return (
    <div>
      <Button style={{margin: '20px', padding: '10px', fontSize: 'var(--buttonTextSize)', width: '190px',
                      height: '3rem', borderRadius: '.4rem', backgroundColor: 'var(--firstColor)',
                      border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                    }} variant="outlined" onClick={handleClickOpen}>
        Run Navigation
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        maps={maps}
      />
    </div>
  );
}

export default RunNavigation;
