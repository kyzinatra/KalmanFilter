import Plotly, { Config, Data, Layout } from "plotly.js-dist-min";
import type { Vec } from "./Vector";

type TPoins = {
  x: number[][];
  y: number[][];
  z?: number[][];
};

export class Visualize {
  private _layout: Partial<Layout> = {
    margin: { t: 70 },
  };
  private _config: Partial<Config> = {
    scrollZoom: true,
    doubleClick: "reset+autosize",
    displayModeBar: true,
  };

  constructor(private _element: HTMLElement | string, layout?: Partial<Layout>, config?: Partial<Config>) {
    if (layout) this._layout = { ...this._layout, ...layout };
    if (config) this._config = { ...this._config, ...config };
  }

  async init() {
    await Plotly.newPlot(this._element, [], this._layout, this._config);
    return this;
  }
  addTrace(config: Data) {
    Plotly.addTraces(this._element, { ...config });
  }
  extendTrace(config: Data, ...trace: number[]) {
    Plotly.extendTraces(this._element, config, trace);
  }

  extendsTraceByVec(vec: Vec, is2d: boolean = false) {
    const points: TPoins = {
      x: [[vec.cords[0]]],
      y: [[vec.cords[1]]],
      z: [[vec.cords[2] || 0]],
    };

    if (is2d) delete points.z;

    this.extendTrace(points, 0);
  }
  moveTrace(config: Data, ...trace: number[]) {
    Plotly.deleteTraces(this._element, trace);
    Plotly.addTraces(this._element, config);
  }
  clear(...traces: number[]) {
    Plotly.deleteTraces(this._element, traces);
  }
}
