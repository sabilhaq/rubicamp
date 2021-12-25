class Tyre {
  constructor(brand, size) {
    this.brand = brand;
    this.size = size;
  }
}

class Car {
  constructor(tyre, door, seat, variant, year, warranty) {
    this.tyre = tyre;
    this.door = door;
    this.seat = seat;
    this.variant = variant;
    this.year = year;
    this.warranty = warranty;
    this.engineNumber = CarFactory.generateNumber();
  }
}

class Rush extends Car {
  constructor(year) {
    super(new Tyre('Bridgestone', '17inch'), 5, 7, 'Rush', year, 3);
  }
}

class Agya extends Car {
  constructor(year) {
    super(new Tyre('Dunlop', '15inch'), 4, 5, 'Agya', year, 1);
  }
}

class CarFactory {
  constructor() {
    this.cars = [];
  }

  static generateNumber() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static randomCount() {
    return Math.floor(Math.random() * 9) + 1;
  }

  produce(year) {
    // produced rush variant
    for (let index = 0; index < CarFactory.randomCount(); index++) {
      this.cars.push(new Rush(year));
    }
    // produced agya variant
    for (let index = 0; index < CarFactory.randomCount(); index++) {
      this.cars.push(new Agya(year));
    }
  }

  guaranteeSimulation(year) {
    console.log(Hasil simulasi garansi untuk tahun ${ year } : );
    this.cars.forEach((car, index) => {
      console.log(`
        car#${index + 1}
        variant         : ${car.variant}
        door            : ${car.door}
        seat            : ${car.seat} seats
        tyre            : ${car.tyre.brand} - ${car.tyre.size}
        engine number   : ${car.engineNumber} 
        warranty        : ${car.warranty} year
        year            : ${car.year} 
        warranty status : ${year - car.year <= car.warranty ? 'active' : 'expired'} 
      `);
    });
  }

  carsInformation() {
    console.log('Hasil produksi mobil seluruhnya :');
    this.cars.forEach((car, index) => {
      console.log(`
        car#${index + 1}
        variant       : ${car.variant}
        door          : ${car.door}
        seat          : ${car.seat} seats
        tyre          : ${car.tyre.brand} - ${car.tyre.size}
        engine number : ${car.engineNumber} 
        warranty      : ${car.warranty} year
        year          : ${car.year} 
      `);
    });
  }
}

const toyota = new CarFactory();
toyota.produce(2019);
toyota.produce(2021);
toyota.carsInformation();
toyota.guaranteeSimulation(2022);