const processAddLoc = (type, name) => {
    return {"type":type,"name":name}
};

const processStartMap = (enable) => {
    return {enable}
};

const processSaveMap = (map, floor) => {
    return {"map":map,"floor":floor}
};

const processStartNav = (map, floor) => {
    return {"map":map,"floor":floor}
};

const processRunTaskBase = (enable) => {
    return {enable}
};

const processStartTask = (locName) => {
    return {"loc_name":locName}
};

const processPauseTask = (enable) => {
    return {enable}
};

const processContinueTask = (enable) => {
    return {enable}
};

const processCancelTask = (enable) => {
    return {enable}
};

const processEnableManualControl = (enable) => {
    return {enable}
};

const processManualControl = (x,z) => {
    return {"cmd": x + "," + z}
};

export {
    processAddLoc,
    processStartMap,
    processSaveMap,
    processStartNav,
    processRunTaskBase,
    processStartTask,
    processPauseTask,
    processContinueTask,
    processCancelTask,
    processEnableManualControl,
    processManualControl
};
