# Kalman Filter

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

## Trilateration description

If you do not have the exact time for which the signal travels from the aircraft to the tower, but only the time of arrival of the signal at each of the three towers, you can use trilateration to determine the position of the aircraft. However, you will need an additional piece of information - the time difference between the signals arriving at each tower.

1. Determine the time difference between the arrival of the signal at each pair of towers:
   Let's say the signal arrives at Tower 1 at time `t1`, at Tower 2 at time `t2`, and at Tower 3 at time `t3`. We can then calculate the time differences between the arrival of the signal at each pair of towers as follows:

Time difference between Tower 1 and Tower 2 = `t2 - t1`
Time difference between Tower 1 and Tower 3 = `t3 - t1`
Time difference between Tower 2 and Tower 3 = `t3 - t2`



2. Use the time differences to calculate the differences in distances between the aircraft and each pair of towers:

Assuming the speed of the signal is constant (for example, the speed of light), we can calculate the differences in distances between the aircraft and each pair of towers as follows:

Difference in distance between Tower 1 and Tower 2 = `(t2 - t1)` - speed of signal
Difference in distance between Tower 1 and Tower 3 = `(t3 - t1)` - speed of signal
Difference in distance between Tower 2 and Tower 3 = `(t3 - t2)` - speed of signal



3. Use the differences in distances to create two hyperbolas, each representing the possible location of the aircraft:

Using the differences in distances calculated in step 2, we can create two hyperbolas that represent the possible location of the aircraft. To do this, we first need to find the two foci of each hyperbola. The foci of each hyperbola represent the locations of the two towers that contributed to the difference in distance.

For example, let's say the differences in distances we calculated in step 2 are:

Difference in distance between Tower 1 and Tower 2 = `d1`
Difference in distance between Tower 1 and Tower 3 = `d2`
Difference in distance between Tower 2 and Tower 3 = `d3`
To create the first hyperbola, we would draw a curve such that the difference between the distances from the aircraft to Tower 1 and Tower 2 is constant, and equal to d1. The foci of this hyperbola would be at the locations of Tower 1 and Tower 2.

To create the second hyperbola, we would draw a curve such that the difference between the distances from the aircraft to Tower 1 and Tower 3 is constant, and equal to `d2`. The foci of this hyperbola would be at the locations of Tower 1 and Tower 3.



4. The intersection point of the two hyperbolas is the actual position of the aircraft:

The intersection point of the two hyperbolas represents the possible location of the aircraft. This is because the aircraft could be at any point on either of the two hyperbolas, and the time difference measurements do not provide enough information to determine the exact location. However, the intersection point is the only point that satisfies both hyperbolas, so it represents the most likely location of the aircraft.

It is important to note that trilateration with time difference measurements can also be affected by various factors such as the accuracy of the time measurements and the presence of obstacles that can affect the signal transmission.



### Example

Assuming that the aircraft is located at point `(x,y,z)`, the equations for the hyperboloids representing the possible locations of the aircraft can be written as follows:

Hyperboloid 1:
`((x - x1)^2 + (y - y1)^2 + (z - z1)^2) - ((x - x2)^2 + (y - y2)^2 + (z - z2)^2) = d1^2`

Where:

(x1, y1, z1) and (x2, y2, z2) are the coordinates of Tower 1 and Tower 2, respectively.
d1 is the constant difference between the distances from the aircraft to Tower 1 and Tower 2.
This equation represents all the possible points (x, y, z) that satisfy the condition that the difference between the distance from the aircraft to Tower 1 and the distance from the aircraft to Tower 2 is constant and equal to d1.

Hyperboloid 2:
`((x - x1)^2 + (y - y1)^2 + (z - z1)^2) - ((x - x3)^2 + (y - y3)^2 + (z - z3)^2) = d2^2`

Where:

`(x3, y3, z3)` are the coordinates of Tower 3.
`d2` is the constant difference between the distances from the aircraft to Tower 1 and Tower 3.
This equation represents all the possible points (x, y, z) that satisfy the condition that the difference between the distance from the aircraft to Tower 1 and the distance from the aircraft to Tower 3 is constant and equal to `d2`.

_The intersection of these two hyperboloids represents the possible location of the aircraft. The exact intersection point(s) can be found using numerical methods, such as nonlinear least squares or maximum likelihood estimation._

## Credits

This project was created by [kyzinatra](https://github.com/kyzinatra) and is licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License).
