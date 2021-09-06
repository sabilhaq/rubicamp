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
  checkWarranty(yearAddition) {
    let countExpired = 0;
    let dateNow = new Date();
    let yearNow = dateNow.getFullYear();
    let predictionYear = yearNow + yearAddition;

    for (let i = 0; i < this.cars.length; i++) {
      if (this.cars[i].age(predictionYear) >= this.cars[i].warranty) {
        console.log(`Masa garansi mobil ${this.cars[i].name} telah habis.`);
        countExpired++;
      }
    }
    return countExpired;
  }
}

// Instance

let toyota = new CarFactory();
toyota.produceCar("Kijang Innova", 2014, 2, "Black", 4, 4, 4);
toyota.produceCar("Avanza", 2020, 3, "Red", 4, 3, 4);
toyota.produceCar("Yaris", 2010, 6, "White", 4, 3, 4);
toyota.productionPerMonth();

// Increase cars age simulation

let yearAddition = Math.floor(Math.random() * 10 + 1);
console.log("Total mobil:", toyota.checkWarranty(yearAddition));
