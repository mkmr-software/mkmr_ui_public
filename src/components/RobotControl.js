import React, { useEffect, useState } from 'react';
import RCcss from '../Styles/RobotControl.module.css';
import config from './config';
import WarningIcon from '@material-ui/icons/Warning';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Button from '@mui/material/Button';
import {processEnableManualControl, processManualControl} from '../Utils/util';

export default function RobotControl({
  payloadWsGeneric,
  mkmr
}) {
  const [cmdX, setCmdX] = useState(0.3);
  const [cmdZ, setCmdZ] = useState(0.2);

  const [cmdXWsData, setCmdXWsData] = useState('0.0');
  const [cmdZWsData, setCmdZWsData] = useState('0.0');

  const handleChangingManualControl = () => {
    if (mkmr.manual_controller_active) {
      payloadWsGeneric(config.EnableManualControl, processEnableManualControl(false))

    } else {
      payloadWsGeneric(config.EnableManualControl, processEnableManualControl(true))
    }
  };

  const useKeyPress = targetKey => {
    const [keyPressed, setKeyPressed] = useState(false);

    const downHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed(true);
    };

    const upHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed(false);
    };

    useEffect(() => {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);

      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
      };
    }, []);

    return keyPressed;
  };

  const [controlButtons, setControlButtons] = useState({
    wPressed: false,
    aPressed: false,
    sPressed: false,
    dPressed: false
  });

  let w = useKeyPress('w');
  let a = useKeyPress('a');
  let s = useKeyPress('s');
  let d = useKeyPress('d');

  useEffect(() => {
    setControlButtons({
      wPressed: w,
      aPressed: a,
      sPressed: s,
      dPressed: d
    });
  }, [w, a, s, d]);


  //if robot controller active -> data send
  useEffect(() => {
    if (mkmr.manual_controller_active) {
      let cmd_x = 0;
      let cmd_z = 0;
      //FL
      if (
        controlButtons.wPressed &&
        controlButtons.aPressed &&
        !(controlButtons.sPressed || controlButtons.dPressed)
      ) {
        //console.log("FL")
        cmd_x = cmdX;
        cmd_z = cmdZ;
      }
      //FR
      else if (
        controlButtons.wPressed &&
        controlButtons.dPressed &&
        !(controlButtons.sPressed || controlButtons.aPressed)
      ) {
        //console.log("FR")
        cmd_x = cmdX;
        cmd_z = -cmdZ;
      }
      //BL
      else if (
        controlButtons.sPressed &&
        controlButtons.aPressed &&
        !(controlButtons.wPressed || controlButtons.dPressed)
      ) {
        //console.log("BL")
        cmd_x = -cmdX;
        cmd_z = -cmdZ;
      }
      //BR
      else if (
        controlButtons.sPressed &&
        controlButtons.dPressed &&
        !(controlButtons.wPressed || controlButtons.aPressed)
      ) {
        //console.log("BR")
        cmd_x = -cmdX;
        cmd_z = cmdZ;
      }
      //F
      else if (
        controlButtons.wPressed &&
        !(controlButtons.dPressed || controlButtons.sPressed || controlButtons.aPressed)
      ) {
        //console.log("F")
        cmd_x = cmdX;
        cmd_z = 0;
      }
      //B
      else if (
        controlButtons.sPressed &&
        !(controlButtons.dPressed || controlButtons.wPressed || controlButtons.aPressed)
      ) {
        //console.log("B")
        cmd_x = -cmdX;
        cmd_z = 0;
      }
      //L
      else if (
        controlButtons.aPressed &&
        !(controlButtons.dPressed || controlButtons.wPressed || controlButtons.sPressed)
      ) {
        //console.log("L")
        cmd_x = 0;
        cmd_z = cmdZ;
      }
      //R
      else if (
        controlButtons.dPressed &&
        !(controlButtons.sPressed || controlButtons.wPressed || controlButtons.aPressed)
      ) {
        //console.log("R")
        cmd_x = 0;
        cmd_z = -cmdZ;
      } else {
        //console.log("else")
        cmd_x = 0;
        cmd_z = 0;
      }
      setCmdXWsData(cmd_x)
      setCmdZWsData(cmd_z)
      // console.log(cmd_x, cmd_z)

      // console.log(controlButtons.wPressed,controlButtons.sPressed,controlButtons.aPressed,controlButtons.dPressed)
    }

  }, [controlButtons]);


  function manualControlDataSend () {
    if(mkmr.manual_controller_active){
      payloadWsGeneric(config.ManualControl, processManualControl(cmdXWsData , cmdZWsData))
    }
    else{
      setCmdXWsData('0.0')
      setCmdZWsData('0.0')
    }
  }

  useEffect(() => {
    manualControlDataSend()
  }, [mkmr]);

  return (
    <div>
          <div className={RCcss.controlContainer}>
            <Button style={{margin: '50px', padding: '10px', fontSize: 'var(--buttonTextSize)',
                            height: '3rem', borderRadius: '.4rem',
                            backgroundColor: (mkmr.manual_controller_active )? 'var(--secondColor)': 'var(--purpleColor)',
                            border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                            }} variant="outlined" disabled={false} onClick={handleChangingManualControl}>
                            <WarningIcon style={{ color: '#ffcc00' }} />
                            {mkmr.manual_controller_active ? "Disable Manual Control" : "Enable Manual Control"}
            </Button>
            <div className={RCcss.wasdButtons}>
              <button
                style={{ fontSize: 'var(--buttonTextSize)',
                  backgroundColor: mkmr.manual_controller_active ? 'var(--firstColor)': 'var(--buttonBackColor)',
                  hover: '1px solid yellow', color: 'var(--textColor)'
                }}
                onMouseDown={() =>
                  setControlButtons({ ...controlButtons, wPressed: true })
                }
                onMouseUp={() =>
                  setControlButtons({ ...controlButtons, wPressed: false })
                }
                onMouseOut={() =>
                  setControlButtons({ ...controlButtons, wPressed: false })
                }
                onTouchStart={() =>
                  setControlButtons({ ...controlButtons, wPressed: true })
                }
                onTouchEnd={() =>
                  setControlButtons({ ...controlButtons, wPressed: false })
                }
                onTouchCancel={() =>
                  setControlButtons({ ...controlButtons, wPressed: false })
                }
                onTouchMove={() =>
                  setControlButtons({ ...controlButtons, wPressed: false })
                }

                disabled={!mkmr.manual_controller_active}
                className={RCcss.wasd}>
                <ExpandLessIcon />W
              </button>
              <button
                style={{ fontSize: 'var(--buttonTextSize)',
                  backgroundColor: mkmr.manual_controller_active ? 'var(--firstColor)': 'var(--buttonBackColor)',
                  hover: '1px solid yellow', color: 'var(--textColor)'
                }}
                onMouseDown={() =>
                  setControlButtons({ ...controlButtons, aPressed: true })
                }
                onMouseUp={() =>
                  setControlButtons({ ...controlButtons, aPressed: false })
                }
                onMouseOut={() =>
                  setControlButtons({ ...controlButtons, aPressed: false })
                }
                onTouchStart={() =>
                  setControlButtons({ ...controlButtons, aPressed: true })
                }
                onTouchEnd={() =>
                  setControlButtons({ ...controlButtons, aPressed: false })
                }
                onTouchCancel={() =>
                  setControlButtons({ ...controlButtons, aPressed: false })
                }
                onTouchMove={() =>
                  setControlButtons({ ...controlButtons, aPressed: false })
                }

                disabled={!mkmr.manual_controller_active}
                className={RCcss.wasd}>
                <ExpandLessIcon style={{ transform: 'rotate(-90deg)' }} />A
              </button>
              <button
                style={{ fontSize: 'var(--buttonTextSize)',
                  backgroundColor: mkmr.manual_controller_active ? 'var(--firstColor)': 'var(--buttonBackColor)',
                  hover: '1px solid yellow', color: 'var(--textColor)'
                }}
                onMouseDown={() =>
                  setControlButtons({ ...controlButtons, sPressed: true })
                }
                onMouseUp={() =>
                  setControlButtons({ ...controlButtons, sPressed: false })
                }
                onMouseOut={() =>
                  setControlButtons({ ...controlButtons, sPressed: false })
                }
                onTouchStart={() =>
                  setControlButtons({ ...controlButtons, sPressed: true })
                }
                onTouchEnd={() =>
                  setControlButtons({ ...controlButtons, sPressed: false })
                }
                onTouchCancel={() =>
                  setControlButtons({ ...controlButtons, sPressed: false })
                }
                onTouchMove={() =>
                  setControlButtons({ ...controlButtons, sPressed: false })
                }
                disabled={!mkmr.manual_controller_active}
                className={RCcss.wasd}>
                S
                <ExpandLessIcon
                  style={{
                    transform: 'rotate(180deg)',
                    position: 'absolute',
                    bottom: '0'
                  }}
                />
              </button>
              <button
                style={{ fontSize: 'var(--buttonTextSize)',
                  backgroundColor: mkmr.manual_controller_active ? 'var(--firstColor)': 'var(--buttonBackColor)',
                  hover: '1px solid yellow', color: 'var(--textColor)'
                }}
                onMouseDown={() =>
                  setControlButtons({ ...controlButtons, dPressed: true })
                }
                onMouseUp={() =>
                  setControlButtons({ ...controlButtons, dPressed: false })
                }
                onMouseOut={() =>
                  setControlButtons({ ...controlButtons, dPressed: false })
                }
                onTouchStart={() =>
                  setControlButtons({ ...controlButtons, dPressed: true })
                }
                onTouchEnd={() =>
                  setControlButtons({ ...controlButtons, dPressed: false })
                }
                onTouchCancel={() =>
                  setControlButtons({ ...controlButtons, dPressed: false })
                }
                onTouchMove={() =>
                  setControlButtons({ ...controlButtons, dPressed: false })
                }
                disabled={!mkmr.manual_controller_active}
                className={RCcss.wasd}>
                D
                <ExpandLessIcon style={{ transform: 'rotate(90deg)' }} />
              </button>
            </div>
          </div>
    </div>
  );
}
