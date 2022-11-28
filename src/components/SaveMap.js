import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import config from './config';
import {processSaveMap} from '../Utils/util';

const SaveMap = ({ payloadWsGeneric, mkmr}) => {
  const [open, setOpen] = React.useState(false);
  const [map, setMap] = React.useState("");
  const [floor, setFloor] = React.useState("0");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSaveMap = () => {
    payloadWsGeneric(config.SaveMap, processSaveMap(map , floor))
    setOpen(false);
  };

  return (
    <div>
      <Button style={{margin: '20px', padding: '10px', fontSize: 'var(--buttonTextSize)', width: '190px',
                      height: '3rem', borderRadius: '.4rem',
                      backgroundColor: mkmr.mapping_active ? 'var(--firstColor)': 'var(--buttonBackColor)',
                      border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                    }} variant="outlined" disabled={!mkmr.mapping_active} onClick={handleClickOpen}>
        Save Map
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ fontSize: '30px' }}>Save Map</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: '20px' }}>
           Enter the name and floor of the map you want to save
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Map Name"
            fullWidth
            variant="standard"
            onChange={(e) => {
                setMap(e.target.value);
              }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Floor"
            fullWidth
            variant="standard"
            onChange={(e) => {
                setFloor(e.target.value);
              }}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{ fontSize: '20px' }} onClick={handleClose}>Cancel</Button>
          <Button style={{ fontSize: '20px' }} onClick={handleCloseSaveMap}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SaveMap;
