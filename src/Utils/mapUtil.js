const MapCalculate = (livePose, rosmap_origin_x, rosmap_origin_y, map_size_y) => {
  const MAP_RESOLUTION = 0.05;
  if (livePose == undefined) {
    return {
      z: 1,
      canvas_origin_x: 0,
      canvas_origin_y: 0
    };
  }
  let x = parseFloat(livePose[0]);
  let y = parseFloat(livePose[1]);
  let z = parseFloat(livePose[2]);

  let map_origin_x = (rosmap_origin_x / MAP_RESOLUTION) * 2;
  let map_origin_y = map_size_y - (rosmap_origin_y / MAP_RESOLUTION) * 2;
  let canvas_origin_x = map_origin_x / 2 + x / MAP_RESOLUTION;
  let canvas_origin_y = map_origin_y / 2 - y / MAP_RESOLUTION;
  return {
    x,
    y,
    z,
    map_origin_x,
    map_origin_y,
    canvas_origin_x,
    canvas_origin_y,
    MAP_RESOLUTION
  };
};
const MapSizeCalculate = (size_x, size_y, origin_x, origin_y) => {
  let map_size_x = size_x * 2;
  let map_size_y = size_y * 2;
  let rosmap_origin_x = origin_x * -1;
  let rosmap_origin_y = origin_y * -1;
  return { map_size_x, map_size_y, rosmap_origin_x, rosmap_origin_y };
};
const getRobotIcon = () => {
  var image = new Image();
  image.src = require('./../assets/Images/robot.png');
  return image;
};
const getLocationIcon = isDarkMode => {
  var image = new Image();
  image.src = require(`./../assets/Images/target.png`);
  return image;
};

const getImageData = img => {
  var canvas = document.createElement('canvas');
  canvas.id = 'robotCanvas';
  var context = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
  var data = context.getImageData(0, 0, img.width, img.height);
  return { robotRef: canvas, data };
};
const getMapColors = isDarkMode => {
  if (isDarkMode) {
    return { O: [255, 255, 255], F: [0, 0, 0], U: [60, 60, 60] };
  }
  return { O: [0, 0, 0], F: [255, 255, 255], U: [120, 120, 120] };
};

export {
  MapCalculate,
  MapSizeCalculate,
  getRobotIcon,
  getImageData,
  getLocationIcon,
  getMapColors
};
