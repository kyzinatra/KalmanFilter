import type { Data } from "plotly.js-dist-min";
import type { Vec } from "../models/utils/Vector";

export function getGraphSettings(vec: Vec, color1: string = "127 0 127", color2: string = "204 0 204"): Data {
  return {
    x: [vec.cords[0] || 0],
    y: [vec.cords[1] || 0],
    z: [vec.cords[2] || 0],
    mode: "lines+markers",
    marker: {
      color: `rgb(${color1?.split(" ").join(", ")})`,
      size: 5,
      symbol: "circle",
      line: {
        color: `rgb(${color2?.split(" ").join(", ")})`,
        width: 2,
      },
      opacity: 0.8,
    },
    type: "scatter3d",
  };
}

export function get2DGraphSettings(vec: Vec, color1: string = "127 0 127", color2: string = "204 0 204"): Data {
  return {
    x: [vec.cords[0] || 0],
    y: [vec.cords[1] || 0],
    mode: "lines+markers",
    marker: {
      color: `rgb(${color1?.split(" ").join(", ")})`,
      size: 3,
      symbol: "circle",
      line: {
        color: `rgb(${color2?.split(" ").join(", ")})`,
        width: 2,
      },
      opacity: 0.8,
    },
    type: "scatter",
  };
}
