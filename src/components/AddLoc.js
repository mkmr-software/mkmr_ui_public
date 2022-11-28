import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import config from './config';
import {processAddLoc} from '../Utils/util';

const AddLoc = ({ payloadWsGeneric, mkmr}) => {
  const [open, setOpen] = React.useState(false);
  const [loc, setLoc] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAddLoc = () => {
    payloadWsGeneric(config.AddLoc, processAddLoc("target" , loc))
    setOpen(false);
  };

  return (
    <div>
      <Button style={{margin: '20px', padding: '10px', fontSize: 'var(--buttonTextSize)', width: '190px',
                      height: '3rem', borderRadius: '.4rem',
                      backgroundColor: mkmr.localization_active ? 'var(--firstColor)': 'var(--buttonBackColor)',
                      border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                    }} variant="outlined" disabled={!mkmr.localization_active} onClick={handleClickOpen}>
        Add Location
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ fontSize: '30px' }}>Add Location</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: '20px' }}>
           Enter the name of the location you want to add
          </DialogContentText>
          <TextField 
            style={{ fontSize: '90px' }}
            autoFocus
            margin="dense"
            id="name"
            label="Location Name"
            fullWidth
            variant="standard"
            onChange={(e) => {
                setLoc(e.target.value);
              }}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{ fontSize: '20px' }} onClick={handleClose}>Cancel</Button>
          <Button style={{ fontSize: '20px' }} onClick={handleCloseAddLoc}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddLoc;
