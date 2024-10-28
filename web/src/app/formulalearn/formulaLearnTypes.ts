export interface Driver {
    driverId: string;
    permanentNumber: string;
    code: string;
    givenName: string;
    familyName: string;
    fullName: string;
    dateOfBirth: string;
    nationality: string;
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