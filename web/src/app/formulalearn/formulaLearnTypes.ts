export interface Driver {
    driverId: string;
    givenName: string;
    familyName: string;
    fullName: string;
    nationality: string;
    permanentNumber: number;
    url: string;
}

export interface Constructor {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
}

export interface Circuit {
    circuitId: string;
    url: string;
    circuitName: string;
    location: {
        lat: string;
        long: string;
        locality: string;
        country: string;
    }
}

export interface OvertakeDriver {
    driverId: number;
    driverNumber: number;
    firstName: string;
    lastName: string;
    age: number;
    nationality: string;
    height: number;
    teamId: number;
    headshotPath: string;
    carImagePath: string;
    teamImagePath: string;
    flagImagePath: string;
    permanentNumber: number;
}

export interface OvertakeConstructor {
    teamId: number;
    name: string;
    fullName: string;
    nationality: string;
    base: string;
    teamChief: string;
    technicalChief: string;
    chassis: string;
    powerUnit: string;
    carImagePath: string;
    teamImagePath: string;
    flagImagePath: string;
    firstYear: number;
}