import Plotly, { Config, Data, Layout } from "plotly.js-dist-min";

export class Visualize {
  private _layout: Partial<Layout> = {
    margin: { t: 50 },
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
  moveTrace(config: Data, ...trace: number[]) {
    Plotly.deleteTraces(this._element, trace);
    Plotly.addTraces(this._element, config);
    Plotly.redraw(this._element);
  }
  clear() {}
}
