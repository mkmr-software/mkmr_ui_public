import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import config from './config';
import {processStartMap} from '../Utils/util';


const RunMapping = ({ payloadWsGeneric}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAndRunMapping = () => {
    payloadWsGeneric(config.StartMap, processStartMap(true))
    setOpen(false);
  };

  return (
    <div>
      <Button style={{margin: '20px', padding: '10px', fontSize: 'var(--buttonTextSize)', width: '190px',
                      height: '3rem', borderRadius: '.4rem', backgroundColor: 'var(--firstColor)',
                      border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                    }} variant="outlined" onClick={handleClickOpen}>
        Run Mapping
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle style={{ fontSize: '30px' }} id="alert-dialog-title">
          {"Are you sure the mapping will run?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: '20px' }} id="alert-dialog-description">
           The current location of the robot will be the starting point of the map
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ fontSize: '20px' }} onClick={handleClose}>Cancel</Button>
          <Button style={{ fontSize: '20px' }} onClick={handleCloseAndRunMapping} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RunMapping;
