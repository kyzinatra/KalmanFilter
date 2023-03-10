# Kalman Filter with TS and ChartJS

This is a project that demonstrates the use of a Kalman filter for estimating the position of a ship navigating through three beacons. The data is visualized using TypeScript and ChartJS.

## Installation
To get started, clone the repository:

```bash
git clone https://github.com/kyzinatra/KalmanFilter.git
cd KalmanFilter
```

Then install the dependencies:

```bash
npm install
```

## Usage
To run the project, use the following command:

```bash
npm run dev
```

This will start the development server, and you can access the project by opening your web browser and navigating to http://localhost:5173.

## How it Works

The Kalman filter is a mathematical tool used to estimate the state of a system based on a series of noisy measurements. In this project, we are using it to estimate the position of a ship as it navigates through three beacons. The beacons are assumed to be at known locations, and the ship's position is estimated based on the time it takes for the signal from each beacon to reach the ship.

The Kalman filter uses a series of predictions and updates to estimate the state of the system. In this case, the state of the system is the position of the ship. The predictions use the known dynamics of the system to estimate where the ship is likely to be at a given time. The updates use the noisy measurements from the beacons to correct the predicted state and improve the estimate of the ship's position.

The visualization shows the estimated position of the ship over time, along with the actual position and the measurements from the beacons. The Kalman filter is able to track the position of the ship more accurately than simply using the noisy measurements from the beacons.

## Credits
This project was created by [kyzinatra](https://github.com/kyzinatra) and is licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License).