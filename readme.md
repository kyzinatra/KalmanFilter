# Kalman Filter

This is a project that demonstrates the use of a Kalman filter for estimating the position of a ship navigating through three beacons. The data is visualized using TypeScript and PlotyJs.

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

## Brief Codebase Information

The `src/models` folder contains classes of physical models. So the navigation class is responsible for the join to work of the ship and beacons. It stores instances of all beacons and the ship. It also creates them and initializes the sending of signals to the beacons by the initCheck method. After the calculation of positions occurs in the findCoord method. The closed solution is calculated and another solution is iteratively calculated using the least squares method, which relies on the closed solution 1 time, and then uses its previous solutions. After the solution is returned to be displayed on the screen.

All utility classes for rendering and calculations are located in `src/models/utils`. The main CoordsCalc class computes the solutions discussed earlier. It also stores the implementation of the matrix and vector.
Start tracking is in `src/utils/startDetection`. The detection function initializes the distribution of signals to beacons and then starts the calculation of coordinates and draws the result. It also runs the `Ship.move()` function to move the ship through space.

By default, 6 beacons and a ship are drawn. You can clear all graphs by clicking the clear button. All other files are needed for the UI and are not directly involved in the modeling. In the main upper part there are 3 graphs that represent the real position of the ship. Its calculation using a closed solution, that is, not an iterative solution, and the last one, for a solution using the least squares method. That is an iterative solution. Below is a graph of the initial location of the vessel and towers.

## Signal generation

To freely receive and process signals, I created a `Navigation` class that creates, stores and uses all instances of the `Ship` and `Beacon` classes. This class implements the `initCheck()` method to send a signal from the ship to beacons. To do this, there is a `getLightDelay()` method on the ship, which returns the delay that is necessary for the light to go from the ship to the lighthouse. After this time is added to the current time and sent to beacons. After this moment, nowhere else possible to find out the time it took the signal to reach the beacons. In the `findCord()` method (which will be discussed later), we only have the exact position of each beacon and TOA (Time of signal arrival). We need to calculate TOE (time of signal emission) and get.

`findCord()` method simply run all methods from `CoordsCalc` class and return result to the main process, which print it on the screen in `src/utils/detection.ts`.

## Methods

### Algorithms for Closed Solution

> The solutions presented in this section are mathematically exact, which means that they use algebraic approaches to solve the problem of hyperbolic positioning. Basically, the problem can be defined by the following system of equations which is set up by writing down equation for different stations [[1]](#source):

$c(t_i - t_e) = \sqrt{(x_i - x)^2 + (y_i - y)^2 + (z_i - z)^2}$

Where is $t_i$ is TOA (Time of signal arrival) and $t_e$ is TOE (Time of signal emission).
Since we have 3-dimensional case we need four equations to solve the problem. (`x`, `y`, `z` and $t_e$)

### Bancroft's Algorithm

The calculations starts with some equation transformation. First of all, we square the equation:

$с^2 (t_i - t_e)^2 = (x_i - x)^2 + (y^i - y)^2 + (z_i - z)^2$

$2(x_i x + y_i y - c^2 t_i t_e) = x^2 + y^2 - c^2 t_e^2 + x_i^2 + y_i^2 - c^2 t_i^2$

> In this case TDOA (Time difference of signal arrival) it's just a useful information which can be retrieved from TOA
>
> $|d_i - d_j| = \sqrt{(x_i - x)^2 + (y_i - y)^2 + (z_i - z)^2} - \sqrt{(x_j - x)^2 + (y_j - y)^2 + (z_j - z)^2}$

It makes no sense to show all the transformations and mathematical calculations there. You can see it here [[1]](#source). I'll show the result and move on the implementation.

![Bncroft_First](./assets/Bancroft%20First.png)
![Bncroft_First](./assets/Bancroft%20Second.png)

To implement this to code, I created the `Vector` and `Matrix` classes.

`Vector` class have a usual methods such as `mul()`, `sub()`, `add()`. You can multiply `Vector` by `Vector` or `Number`. You can see the implementation in the `./src/modules/Vector.ts` file.

Next, I created a `Matrix` class for my tasks. I have 3 different methods for multiplying by a scalar, a vector and another matrix, methods have also been made to calculate the determinant in `O(n^3)` and simply matrix invert by adding an identity matrix on the right. All these methods allowed me feel free to work with the formulas above and create the `getClosedSolution()` method, which implements all these mathematical calculations.

### Applied Adjustment Theory in Multilateration

> In Multilateration the basic equations are built by the well known equation system, shown above. These equations can be transformed into the following form and, for the sake of simplicity, we newly replace the time variables by the so-called pseudo ranges [[1]](#source)

$ct_i = \sqrt{(x_i - x)^2 + (y_i - y)^2 + (z_i - z)^2} + ct_e$

1. We have to calculate the following derivatives to perform the tailor expansion

$\frac{\partial m_i}{\partial x} = \frac{x - x_i}{d_i}$

$\frac{\partial m_i}{\partial y} = \frac{y - y_i}{d_i}$

$\frac{\partial m_i}{\partial z} = \frac{z - z_i}{d_i}$

$\frac{\partial m_i}{\partial r_e} = 1$

$d_i = \sqrt{(x_i - x)^2 + (y_i - y)^2}$

Where the $d_i$ is the distance between the i-th base stations and the target.
So, we can get the following system

$d\vec{m} = Ad\vec{x}$

where

$A = \begin{bmatrix}\frac{\partial m_1}{\partial x}(\vec{x_a}) & \frac{\partial m_1}{\partial y}(\vec{x_a}) & \frac{\partial m_1}{\partial z}(\vec{x_a}) & \frac{\partial m_1}{\partial r_e}(\vec{x_a})\\\frac{\partial m_2}{\partial x}(\vec{x_a}) & \frac{\partial m_2}{\partial y}(\vec{x_a}) & \frac{\partial m_2}{\partial z}(\vec{x_a}) & \frac{\partial m_2}{\partial r_e}(\vec{x_a})\\ . & . & . & .\\ . & . & . & .\\ . & . & . & .\\\frac{\partial m_n}{\partial x}(\vec{x_a}) & \frac{\partial m_n}{\partial y}(\vec{x_a}) & \frac{\partial m_n}{\partial z}(\vec{x_a}) & \frac{\partial m_n}{\partial r_e}(\vec{x_a})\end{bmatrix}$

$d\vec{m} = \vec{m} - \vec{m}(\vec{x_a})$

$d\vec{x} = \vec{x} - \vec{x_a}$

### Steps to calculate solution

1. Putting up the system matrix A in the point $\vec{x_a}$.
1. Calculate $d\vec{x}$
1. Calculate $d\vec{x}$ using these formulas:

$d\vec{x} = (A^TPA)A^TPd\vec{m}$

$\vec{x} = \vec{x_a} + d\vec{x}$

4. Repeat from step 1, but replacing $\vec{x_a}$ by the $\vec{x}$

## Source

1. [Elaboration of Methods and Algorithms for Passive Aircraft and Vehicle Detection over Time of Signal Arrival Differences](https://diglib.tugraz.at/download.php?id=576a75430e75f&location=browse)

## Credits

This project was created by [kyzinatra](https://github.com/kyzinatra) and is licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License).
