// Class declarations

class Car {
  constructor(name, year, warranty, color, totalDoor, totalChair, totalTyre) {
    this.name = name;
    this.year = year;
    this.warranty = warranty;
    this.color = color;
    this.totalDoor = totalDoor;
    this.totalChair = totalChair;
    this.totalTyre = totalTyre;
  }
  age(yearNow) {
    return yearNow - this.year;
  }
}

class CarFactory {
  totalCar = 0;
  cars = [];
  constructor() {
    this.totalCar = 0;
  }
  // Method
  productionPerMonth() {
    return Math.floor(Math.random() * (10 - 2) + 2);
  }
  produceCar(name, year, warranty, color, totalDoor, totalChair, totalTyre) {
    let car = new Car(
      name,
      year,
      warranty,
      color,
      totalDoor,
      totalChair,
      totalTyre
    );
    this.totalCar++;
    this.cars.push(car);
  }
}

// Instance

let factory = new CarFactory();
factory.produceCar("Honda", 2014, 2, "Black", 4, 4, 4);
factory.produceCar("Toyota", 2020, 3, "Red", 4, 3, 4);
factory.productionPerMonth();

// Increase cars age simulation

function checkWarranty(yearAddition) {
  let countExpired = 0;
  let dateNow = new Date();
  let yearNow = dateNow.getFullYear();
  let predictionYear = yearNow + yearAddition;

  for (let i = 0; i < factory.cars.length; i++) {
    if (factory.cars[i].age(predictionYear) >= factory.cars[i].warranty) {
      console.log(`Masa garansi mobil ${factory.cars[i].name} telah habis.`);
      countExpired++;
    }
  }
  return countExpired;
}

let yearAddition = Math.floor(Math.random() * 10 + 1);
console.log("Total mobil:", checkWarranty(yearAddition));
