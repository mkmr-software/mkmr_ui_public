import React, {useRef, useState, useEffect} from 'react';
import {wsConnectionStatus } from './Enum';
import config from './config';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import StateContainer from './StateContainer';
import styles from '../Styles/MkmrProject.module.css';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RobotLiveMap from './RobotLiveMap';
import RunMapping from './RunMapping';
import RunNavigation from './RunNavigation';
import SaveMap from './SaveMap';
import AddLoc from './AddLoc';
import {processRunTaskBase, processStartTask, processPauseTask, processContinueTask, processCancelTask} from '../Utils/util';
import Button from '@mui/material/Button';
import RobotControl from './RobotControl';

const MkmrUi = () => {

    const ws = useRef(null);
    const [projectId, setProjectId] = useState();
    const [robotId, setRobotId] = useState();
    const [mkmr, setMkmr] = useState({});
    const [cfg, setCfg] = useState({});
    const [activeMap, setActiveMap] = useState({
        map: null,
        compressedMap: null,
        locations: null,
        robotLocation: { x: null, y: null, z: null, lastUpdateDate: new Date() },
      });

    const payloadWsGeneric = (topicName, message) => {
        const payload = payloadGeneric(topicName, message);
    
        if (payload !== undefined) {
          ws.current.send(JSON.stringify(payload));
        }
    };
    
    const payloadGeneric = (topicName, message) => {
        if (wsConnectionStatus.OPEN === ws.current.readyState) {
            return {
                project_id: projectId,
                robot_id: robotId,
                topic: topicName,
                message: message || ''
            };
        }
    };

    const runWebSocket = () => {
        console.log("Reload Page" , "ws://" + process.env.REACT_APP_MKMR_UI_IP + ":" + process.env.REACT_APP_MKMR_UI_PORT)
        ws.current = new WebSocket(
            "ws://" + process.env.REACT_APP_MKMR_UI_IP + ":" + process.env.REACT_APP_MKMR_UI_PORT
        );
        ws.current.onopen = () => {};
        ws.current.onclose = () => {
            console.log('ws closed')
            if (ws.current?.readyState === wsConnectionStatus.CLOSED)
            {
                resetData();
                runWebSocket();
            }
            
        };
        const wsCurrent = ws.current;
        ws.current.onmessage = event => {
            // console.log("event", event)
            const data = JSON.parse(event.data);
            // console.log(data.message)
            // console.log(data.topic, data.message)
            switch (data.topic) {
                case config.ClientConnected:
                    setProjectId(data.project_id.toString())
                    setRobotId(data.robot_id)
                    break;
                case "mkmr":
                    setMkmr(JSON.parse(data.message));
                    break;
                case "CFG":
                    setCfg(data.message);
                    break;
                case "compressed_map":
                    // console.log("compressed_map", data.message , typeof(data.message))
                    if(data.message !== ""){
                        var splitted_data = JSON.parse(data.message)?.data.split(',');
                        if (!splitted_data) {
                        return;
                        }
                        if (splitted_data.length < 5) {
                            return;
                        }
                        let map = {"size_x":splitted_data[0],"size_y":splitted_data[1],"origin_x":splitted_data[2],"origin_y":splitted_data[3],"full_map_compressed":JSON.parse(data.message).data}
                        setActiveMap(prev => ({
                            ...prev,
                            map: map
                        }));
                    }
                    break;
                case config.Heartbeat:
                    console.log(data.topic)
                    payloadWsGeneric(config.Heartbeat, data.message);
                    break;
                default:
            }
        };

        return () => {
            wsCurrent.close();
        };
    };

    const resetData = () => {
        setMkmr({});
        setCfg({});
        setActiveMap({
            map: null,
            compressedMap: null,
            locations: null,
            robotLocation: { x: null, y: null, z: null, lastUpdateDate: new Date() },
          });
    };

    useEffect(() => {
        if (ws.current) {
          ws.current.close();
        }
        resetData();
        runWebSocket();
    }, []);

    useEffect(() => {
        let actualLocs = []
        cfg["locs"]?.map((value, key)=>{
            if(mkmr?.floor !== value["floor"] || mkmr?.map !== value["map"]){
                return
            }
            actualLocs.push({"px":value["px"],"py":value["py"],"yaw":value["yaw"]})
        })
        setActiveMap(prev => ({
            ...prev,
            locations: actualLocs
        }));
    }, [mkmr.map, mkmr.floor, cfg]);


    const SiteOnClick = (e) => {
        payloadWsGeneric(config.StartTask, processStartTask(e.target.firstChild.data))
    }

    const handleRunTaskBase = (value) => {
        payloadWsGeneric(config.RunTaskBase, processRunTaskBase(true))
    };

    const handlePauseTask = (value) => {
        payloadWsGeneric(config.PauseTask, processPauseTask(true))
    };

    const handleContinueTask = (value) => {
        payloadWsGeneric(config.ContinueTask, processContinueTask(true))
    };

    const handleCancelTask = (value) => {
        payloadWsGeneric(config.CancelTask, processCancelTask(true))
    };

    

  return (
    <div className={styles.mkmrContainer}>
        <Header/>
        {/* *****  */}
        <Grid container spacing={1}>
            <Grid item md={7}>
                {/* *****  */}    
                <Grid container spacing={1}>
                    <Grid item md={8}>
                        {/* *****  */}    
                        <Grid container spacing={2}>
                            <Grid item md={3}>
                                <StateContainer color="white" title={"Project Id"} value={projectId} />
                            </Grid>
                            <Grid item md={3}>
                                <StateContainer color="white" title={"Robot Id"} value={robotId} />
                            </Grid>
                            <Grid item md={3}>
                                <StateContainer color="white" title={"Map"} value={mkmr.map} />
                            </Grid>
                            <Grid item md={3}>
                                <StateContainer color="white" title={"Floor"} value={mkmr.floor} />
                            </Grid>
                            <Grid item md={6}>
                                <StateContainer color="white" title="Position"
                                    value={"px ".concat(mkmr.px ? mkmr.px : "0.00") +
                                    " py ".concat(mkmr.py ? mkmr.py : "0.00") + 
                                    " yaw ".concat(mkmr.yaw ? mkmr.yaw : "0.00")}/> 
                            </Grid> 
                            <Grid item md={6}>
                                <StateContainer color="white" title="Velocity"
                                    value={"Linear ".concat(mkmr.cmd_vel_x ? mkmr.cmd_vel_x.toFixed(2) : "0.00") +
                                    " Angular ".concat(mkmr.cmd_vel_z ? mkmr.cmd_vel_z.toFixed(2) : "0.00")}/> 
                            </Grid>
                            <Grid item md={6}>
                                <StateContainer color="white" title={"Robot State"} value={mkmr.state} />
                            </Grid>
                            <Grid item md={3}>
                                <StateContainer color="white" title={"Target Location"} value={mkmr.target_name} />
                            </Grid>
                            <Grid item md={3}>
                                <StateContainer color="white" title={"Last Done Target"} 
                                                                        value={mkmr.last_done_target_name} />
                            </Grid>

                            {/* *****  */}    
                            <Grid container spacing={1}>
                                <Grid item md={1}>
                                    <FiberManualRecordIcon style={{ marginTop: "20px",
                                        color: ws.current?.readyState === wsConnectionStatus.OPEN ? 'green' : 'red' , 
                                        }} />
                                </Grid>
                                <Grid item md={2}>
                                    <div style={{ marginTop: "10px", fontSize: 'var(--ledLabelTextSize)'}}>
                                        <span >{"Robot"}</span> 
                                    </div>
                                </Grid>
                                <Grid item md={1}>
                                    <FiberManualRecordIcon style={{ marginTop: "20px", 
                                        color: mkmr.mapping_active === true ? 'green' : '#6c6c6c', 
                                        }} />
                                </Grid>
                                <Grid item md={2}>
                                    <div style={{ marginTop: "10px", fontSize: 'var(--ledLabelTextSize)'}}>
                                        <span>{"Mapping"}</span> 
                                    </div>
                                    
                                </Grid>
                                <Grid item md={1}>
                                    <FiberManualRecordIcon style={{ marginTop: "20px", 
                                        color: mkmr.localization_active === true ? 'green' : '#6c6c6c',
                                        }} />
                                </Grid>
                                <Grid item md={5}>
                                    <div style={{ marginTop: "10px", fontSize: 'var(--ledLabelTextSize)', marginRight: "300px"}}>
                                        <span>{"Navigation"}</span> 
                                    </div>
                                </Grid>
                                <Grid item md={1}>
                                    <FiberManualRecordIcon style={{ marginTop: "30px", 
                                        color: mkmr.normal_speed_enabled === true ? 'blue' : '#6c6c6c',
                                        }} />
                                </Grid>
                                <Grid item md={3}>
                                    <div style={{ marginTop: "20px", fontSize: 'var(--ledLabelTextSize)'}}>
                                        <span>{"Warning Zone 1"}</span> 
                                    </div>
                                </Grid> 
                                <Grid item md={1}>
                                    <FiberManualRecordIcon style={{ marginTop: "30px", 
                                        color: mkmr.slow_speed_enabled === true ? 'yellow' : '#6c6c6c',
                                        }} />
                                </Grid>
                                <Grid item md={3}>
                                    <div style={{ marginTop: "20px", fontSize: 'var(--ledLabelTextSize)'}}>
                                        <span>{"Warning Zone 2"}</span> 
                                    </div>
                                </Grid>  
                                <Grid item md={1}>
                                    <FiberManualRecordIcon style={{ marginTop: "30px", 
                                        color: mkmr.soft_runstop_priority === true ? 'red' : '#6c6c6c',
                                        }} />
                                </Grid>
                                <Grid item md={3}>
                                    <div style={{ marginTop: "20px", fontSize: 'var(--ledLabelTextSize)'}}>
                                        <span>{"Safety Zone"}</span> 
                                    </div>
                                </Grid>                                                                  
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item md={4}>
                        <RunMapping payloadWsGeneric={payloadWsGeneric}/>
                        <RunNavigation payloadWsGeneric={payloadWsGeneric}  maps={cfg["maps"]}/>
                        <SaveMap payloadWsGeneric={payloadWsGeneric} mkmr={mkmr}/> 
                        <AddLoc payloadWsGeneric={payloadWsGeneric} mkmr={mkmr}/> 
                        <RobotControl payloadWsGeneric={payloadWsGeneric} mkmr={mkmr}/>   
                    </Grid>
                </Grid>
                {/* *****  */} 
                <Grid container spacing={1}>
                    <Grid item md={8}>
                        <div style={{ marginTop: "20px"}}>
                            <span>{"Robot Locations"}</span> 
                        </div>
                    </Grid>                    
                </Grid> 
                {/* *****  */}   
                <Grid container spacing={2}>
                    <Grid item md={8}>
                        {      
                            cfg["locs"]?.map((value, key)=>{
                                if(mkmr?.floor !== value["floor"] || mkmr?.map !== value["map"]){
                                    return
                                }
                                return <Button 
                                style={{margin: '20px', padding: '10px', fontSize: 'var(--buttonTextSize)', 
                                    height: '3rem', borderRadius: '.4rem', 
                                    backgroundColor: (mkmr.state === "" || mkmr.state === "PAUSE" )? 'var(--buttonBackColor)': 'var(--secondColor)',
                                    border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                                    }}
                                onClick={(e) => SiteOnClick(e)}
                                key={key}
                                disabled={(mkmr.state === "" || mkmr.state === "PAUSE" )}
                                >
                                {value["name"]}
                                </Button>
                            })}
                    </Grid>
                    <Grid item md={4}>

                        <Button style={{margin: '20px', padding: '10px', fontSize: 'var(--buttonTextSize)', width: '210px',
                            height: '3rem', borderRadius: '.4rem',
                            backgroundColor: mkmr.localization_active ? 'var(--firstColor)': 'var(--buttonBackColor)',
                            border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                            }} variant="outlined" disabled={!mkmr.localization_active} onClick={handleRunTaskBase}>
                            Run Task System
                        </Button>                    
                        <Button style={{margin: '20px', padding: '10px', fontSize: 'var(--buttonTextSize)', width: '210px',
                            height: '3rem', borderRadius: '.4rem',
                            backgroundColor: ((mkmr.state !== "" && mkmr.state !== "PAUSE") && mkmr.localization_active)? 'var(--redColor)': 'var(--buttonBackColor)',
                            border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                            }} variant="outlined" disabled={(mkmr.state === "" || mkmr.state === "PAUSE" )} onClick={handlePauseTask}>
                            Pause Task
                        </Button>
                        <Button style={{margin: '20px', padding: '10px', fontSize: 'var(--buttonTextSize)', width: '210px',
                            height: '3rem', borderRadius: '.4rem',
                            backgroundColor: mkmr.state === "PAUSE" ? 'var(--greenColor)': 'var(--buttonBackColor)',
                            border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                            }} variant="outlined" disabled={mkmr.state !== "PAUSE"} onClick={handleContinueTask}>
                            Continue Task
                        </Button>    
                        <Button style={{margin: '20px', padding: '10px', fontSize: 'var(--buttonTextSize)', width: '210px',
                            height: '3rem', borderRadius: '.4rem',
                            backgroundColor: ((mkmr.state !== "" && mkmr.state !== "PAUSE") && mkmr.localization_active)? 'var(--firstColor)': 'var(--buttonBackColor)',
                            border: 'none', color: 'var(--textColor)', cursor: 'pointer'
                            }} variant="outlined" disabled={(mkmr.state === "" || mkmr.state === "PAUSE" )} onClick={handleCancelTask}>
                            Cancel Task
                        </Button>                    
                    </Grid>                    
                </Grid>
            </Grid>
            <Grid item md={5}>
                <RobotLiveMap
                    activeMap={activeMap}
                    mkmr={mkmr}
                    isDarkMode={false}
                />
            </Grid>

        </Grid>

    </div>
  );
};


export default MkmrUi;
