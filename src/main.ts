import Chart from "chart.js/auto";

const App = document.querySelector("#app") as HTMLCanvasElement;

export function Init() {
  console.info("Initialize");

  Chart.overrides.line.spanGaps = true;

  if (!App) return;

  const data: number[] = Array.from({ length: 150 }, () => Math.random() * 1000);
  const data2: number[] = Array.from({ length: 150 }, (_, i) => data.slice(0, i).reduce((t, e) => t + +e, 0) / i);
  new Chart(App, {
    type: "line",
    data: {
      labels: Array.from({ length: data.length }, (a, i) => i),
      datasets: [
        // { label: "first", data },
        { label: "middle", data: data2 },
        { label: "line", data: Array.from({ length: 150 }).fill(500) },
      ],
    },
  });
}
Init();
