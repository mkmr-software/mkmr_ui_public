import React, { Component, useRef, Fragment, useEffect, useState, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import styles from '../Styles/RobotLive.module.css';
import {
  getRobotIcon,
  getLocationIcon,
  MapCalculate,
  MapSizeCalculate,
  getImageData,
  getMapColors
} from '../Utils/mapUtil';
import { GpsFixed } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Button } from '@material-ui/core';

const RobotLiveMap = ({ activeMap, mkmr, isDarkMode }) => {
  const { map, mapBase64, locations } = activeMap;
  const [mapSize, setMapSize] = useState({ width: 500, height: 500 });
  const [mapOrigin, setMapOrigin] = useState({ x: null, y: null });
  const [scale, setScale] = useState(1);
  const [isFocus, setIsFocus] = useState(false);
  const canvasRef2 = useRef(null);
  const canvasContainerRef = useRef(null);
  const robotIcon = useMemo(() => getRobotIcon(), []);
  const locationIcon = useMemo(() => getLocationIcon(isDarkMode), [isDarkMode]);
  const mapColors = useMemo(() => getMapColors(isDarkMode), [isDarkMode]);
  const drawNewMap = async (
    z,
    canvas_origin_x,
    canvas_origin_y,
    mapOriginX,
    mapOriginY
  ) => {
    var ctx = canvasRef2.current.getContext('2d');
    var data = map?.full_map_compressed?.split(',');
    if (!data) {
      return;
    }
    ctx.clearRect(0, 0, canvasRef2.current.width, canvasRef2.current.height);
    setMapSize({ height: data[1], width: data[0] });
    var img = ctx.createImageData(data[0], data[1]);
    var mapD = data.slice(4);
    var index = 0;
    for (var i = 0; i < mapD.length; i++) {
      drawPixel(
        img,
        index,
        mapColors[mapD[i].split('x')[1]],
        parseInt(mapD[i].split('x')[0]) * 4
      );
      index += parseInt(mapD[i].split('x')[0]) * 4;
    }
    ctx.save();
    const bitmap = await createImageBitmap(img);
    ctx.translate(img.width / 2, img.height / 2);

    ctx.scale(1, -1);
    ctx.translate(-img.width / 2, -img.height / 2);

    ctx.drawImage(bitmap, 0, 0);
    ctx.save();
    ctx.translate(img.width / 2, img.height / 2);

    ctx.scale(1, -1);
    ctx.translate(-img.width / 2, -img.height / 2);
    if (locations && locations.length > 0) {
      locations.forEach(element => {
        ctx.save();
        ctx.translate(
          mapOriginX / 2 + element.px / 0.05 ,
          mapOriginY / 2 - element.py / 0.05 
        );
        ctx.rotate(-(Math.PI / 180) * element.yaw);
        ctx.drawImage(
          locationIcon,
          -locationIcon.width / 4,
          -locationIcon.height / 4,
          16,
          16
        );
        ctx.rotate(-(Math.PI / 180) * element.yaw_deg);
        ctx.translate(
          -1 * (mapOriginX / 2 + element.px / 0.05 - 5),
          -1 * (mapOriginY / 2 - element.py / 0.05 - 5)
        );

        ctx.restore();
      });
    }
    ctx.save();

    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    ctx.shadowColor = '#f00';
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.translate(canvas_origin_x, canvas_origin_y + 0);
    ctx.rotate(-(Math.PI / 180) * z);
    ctx.drawImage(robotIcon, -10, -10, 20, 20);
    ctx.imageSmoothingEnabled = true;
    if (isFocus) {
      ctx.shadowBlur = 3;
      ctx.strokeRect(-robotIcon.width / 2, -robotIcon.height / 2, 20, 20);
    }

    ctx.rotate(-(Math.PI / 180) * z);
    ctx.translate(-canvas_origin_x, -canvas_origin_y - 0);
    ctx.closePath();
    ctx.restore();
  };

  const drawPixel = (img, index, color, loopCount) => {
    for (let i = 0; i <= loopCount; i += 4) {
      img.data[index + i + 0] = color[0];
      img.data[index + i + 1] = color[1];
      img.data[index + i + 2] = color[2];
      img.data[index + i + 3] = color[2];
    }
  };
  useEffect(() => {
    if (map && Object.keys(map).length > 0) {

      const {
        map_size_x,
        map_size_y,
        rosmap_origin_x,
        rosmap_origin_y
      } = MapSizeCalculate(map.size_x, map.size_y, map.origin_x, map.origin_y);

      const livePoseValues = [
        mkmr.px,
        mkmr.py,
        mkmr.yaw
      ];

      const {
        z,
        canvas_origin_x,
        canvas_origin_y,
        map_origin_x,
        map_origin_y
      } = MapCalculate(livePoseValues, rosmap_origin_x, rosmap_origin_y, map_size_y);
      setMapOrigin({ x: map_origin_x, y: map_origin_y });
      drawNewMap(z, canvas_origin_x, canvas_origin_y, map_origin_x, map_origin_y);
    }
  }, [activeMap.robotLocation, map, isFocus, isDarkMode, mkmr]);
  const startZoom = (ref, e) => {
    var scale = ref.instance.transformState.scale;
    var w = Math.round(canvasRef2.current.width * scale);
    var h = Math.round(canvasRef2.current.height * scale);
    setScale(scale);
  };
  const focusRobot = resetTransform => {
    setIsFocus(true);
    setTimeout(() => {
      setIsFocus(false);
    }, 4000);
    resetTransform();
  };
  const getPosition = e => {
    var canvas = canvasRef2.current;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    return { x, y };
  };
  return (
    <>
      <div className={styles.liveMapContainer} ref={canvasContainerRef}>
        <TransformWrapper initialScale={1.3} onZoom={(ref, e) => startZoom(ref, e)}>
          {({ zoomIn, zoomOut, resetTransform, centerView, ...rest }) => (
            <>
              <TransformComponent
                contentStyle={{
                  maxHeight: map?.size_y < 730 ? '730px' : window.innerHeight - 20,
                  width: map?.size_x < 800 ? '800px' : '100%'
                }}>
                <canvas
                  height={map?.size_y < 500 ? 500 : map?.size_y}
                  id="canvas2"
                  onClick={event => getPosition(event)}
                  ref={canvasRef2}
                  width={map?.size_x < 500 ? 500 : map?.size_x}
                />
              </TransformComponent>
              <div className={styles.gpsContainer}>
                <span className={styles.zoomInOut}>
                  <Button
                    onClick={() => zoomIn()}
                    size="small"
                    style={{ minWidth: '29px', height: '59px' }}>
                    <AddIcon />
                  </Button>
                  <Button
                    onClick={() => zoomOut()}
                    size="small"
                    style={{ minWidth: '29px', height: '59px' }}>
                    <RemoveIcon fontSize="medium" />
                  </Button>
                </span>
                <span className={styles.gpsIcon}>
                  <Button
                    onClick={() => focusRobot(resetTransform)}
                    size="small"
                    style={{ minWidth: '29px', height: '29px' }}>
                    <GpsFixed fontSize="small" style={{ width: '100%' }} />
                  </Button>
                </span>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
    </>
  );
};
export default RobotLiveMap;
