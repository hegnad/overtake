export async function getNextRace() {
  const apiUrl = "https://ergast.com/api/f1/current/next.json";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const raceInfo = data.MRData.RaceTable.Races[0];

    const raceName = raceInfo.raceName;
    const circuitName = raceInfo.Circuit.circuitName;
    const raceDate = raceInfo.date;
    const raceTime = raceInfo.time;
    const roundNumber = raceInfo.round;
    const raceTimeDate = new Date(`${raceDate}T${raceTime}`);
    const circuitLocation = raceInfo.Circuit.Location.locality;
    let gpName = raceName;
    try {
      const apiUrlGPName = `https://api.openf1.org/v1/meetings?year=2024&location=${raceInfo.Circuit.Location.country}`;
      const responseGPName = await fetch(apiUrlGPName);
      const dataGPName = await responseGPName.json();
      gpName = dataGPName[0].meeting_official_name;
    } catch (error) {
      console.error("Error fetching GP name: ", error);
    }

    return {
      raceName,
      circuitName,
      circuitLocation,
      raceTimeDate,
      gpName,
      roundNumber,
    };
  } catch (error) {
    console.error("Error fetching race data: ", error);
    return null;
  }
}

export async function getRaceResults(season, round) {
    const apiUrl = `https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const raceInfo = data.MRData.RaceTable.Races[0];
    const raceName = raceInfo.raceName;
    const raceResults = raceInfo.Results;
    const season = raceInfo.season;
    const round = raceInfo.round;

    return {
      raceName,
      raceResults,
      season,
      round,
    };
  } catch (error) {
    console.error("Error fetching race data: ", error);
    return null;
  }
}

export async function getPrevRace() {
    const apiUrl = "https://api.jolpi.ca/ergast/f1/current/last/results.json";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch race results");
    }

    const data = await response.json();
    const raceResults = data.MRData.RaceTable.Races[0].Results.slice(0, 10).map(
      (result) => `${result.Driver.givenName} ${result.Driver.familyName}`
    );

    console.log("Fetched previous race results:", raceResults);
    return raceResults;
  } catch (error) {
    console.error("Error fetching previous race results:", error);
    return [];
  }
}

export async function getSeasonRounds(season) {
    const apiUrl = `https://api.jolpi.ca/ergast/f1/${season}.json`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const seasonRounds = data.MRData.RaceTable.Races.map(
      (race) => race.raceName
    );
    return seasonRounds;
  } catch (error) {
    console.error("Error fetching season rounds: ", error);
    return null;
  }
}

export async function getDrivers() {
    const apiUrl = "https://api.jolpi.ca/ergast/f1/current/last/drivers.json";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch drivers");
    }

    const data = await response.json();
    const ergastDrivers = data.MRData.DriverTable.Drivers.map((driver) => ({
      driverId: driver.driverId,
      permanentNumber: driver.permanentNumber,
      code: driver.code,
      givenName: driver.givenName,
      familyName: driver.familyName,
      fullName: `${driver.givenName} ${driver.familyName}`,
      dateOfBirth: driver.dateOfBirth,
      nationality: driver.nationality,
      url: driver.url,
    }));

    return ergastDrivers;
  } catch (error) {
    console.error("Error fetching drivers data: ", error);
    return null;
  }
}

export async function getConstructors() {
    const apiUrl = "https://api.jolpi.ca/ergast/f1/current/constructors.json";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch constructors");
    }

    const data = await response.json();
    const ergastConstructors = data.MRData.ConstructorTable.Constructors.map(
      (constructor) => ({
        constructorId: constructor.constructorId,
        url: constructor.url,
        name: constructor.name,
        nationality: constructor.nationality,
      })
    );

    return ergastConstructors;
  } catch (error) {
    console.error("Error fetching constructors data: ", error);
    return null;
  }
}

export async function getCircuits() {
    const apiUrl = "https://api.jolpi.ca/ergast/f1/current.json";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch circuits");
    }

    const data = await response.json();
    const ergastCircuits = data.MRData.RaceTable.Races.map((race) => ({
      circuitId: race.Circuit.circuitId,
      url: race.Circuit.url,
      circuitName: race.Circuit.circuitName,
      location: {
        lat: race.Circuit.Location.lat,
        long: race.Circuit.Location.long,
        locality: race.Circuit.Location.locality,
        country: race.Circuit.Location.country,
      },
    }));

    return ergastCircuits;
  } catch (error) {
    console.error("Error fetching circuits data: ", error);
    return null;
  }
}

export async function overtakerOfTheRace() {
    const apiUrl = "https://api.jolpi.ca/ergast/f1/current/last/results.json";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    const overtakes = data.MRData.RaceTable.Races[0].Results.map((result) => ({
      driverId: result.number,
      firstName: result.Driver.givenName,
      lastName: result.Driver.familyName,
      finishPosition: result.position,
      startingPosition: result.grid,
      overtakes: result.grid - result.position,
    }));
    overtakes.sort((a, b) => b.overtakes - a.overtakes);
    console.log("Fetched overtakes:", overtakes);
    return overtakes[0];
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
}

export async function getWinsOfDriver(driverId) {
    const apiUrl = `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/results/1.json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        const data = await response.json();
        const total = data.MRData.total;
        console.log("Fetched total:", total);
        return total;
    } catch (error) {
        console.error("Error fetching total wins of driver: ", error);
        return null;
    }
}

export async function getPodiumsOfDriver(driverId) {
    const urls = [
        `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/results/1.json`, // Position 1
        `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/results/2.json`, // Position 2
        `https://api.jolpi.ca/ergast/f1/drivers/${driverId}/results/3.json`, // Position 3
    ];

    try {
        // Fetch all URLs concurrently
        const responses = await Promise.all(urls.map(url => fetch(url)));

        // Check if any fetch failed
        if (responses.some(response => !response.ok)) {
            throw new Error("Failed to fetch podium data");
        }

        // Parse all responses
        const data = await Promise.all(responses.map(response => response.json()));

        // Extract and sum up totals
        const totalPodiums = data.reduce((sum, result) => sum + Number(result.MRData.total), 0);

        console.log("Total podiums:", totalPodiums);
        return totalPodiums;
    } catch (error) {
        console.error("Error fetching total podium finishes of driver:", error);
        return null;
    }
}

export async function getDriverStanding(driverId) {
    const apiUrl = `https://api.jolpi.ca/ergast/f1/current/drivers/${driverId}/driverStandings.json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch driver standings");
        }

        const data = await response.json();
        const position =
            data.MRData?.StandingsTable?.StandingsLists[0]?.DriverStandings[0]?.position;

        if (position) {
            console.log(`Fetched position for driver ${driverId}:`, position);
            return position;
        } else {
            console.warn("No position data available for driver:", driverId);
            return null;
        }
    } catch (error) {
        console.error("Error fetching driver standings:", error);
        return null;
    }
}

export async function getDriverSeasonResults(driverId) {
    const currentYear = new Date().getFullYear();
    const seasons = [currentYear, currentYear - 1, currentYear - 2]; // Current and past two seasons
    const results = [];

    // Exponential backoff function
    async function fetchWithBackoff(url, maxRetries = 5, delay = 500) {
        let retries = 0;

        while (retries < maxRetries) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    return await response.json();
                } else if (response.status === 429) {
                    // Handle rate limit with exponential backoff
                    retries++;
                    const backoffDelay = delay * 2 ** retries; // Exponential increase
                    console.warn(`Too many requests. Retrying in ${backoffDelay} ms...`);
                    await new Promise((resolve) => setTimeout(resolve, backoffDelay));
                } else {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error fetching ${url} on attempt ${retries + 1}:`, error);
                retries++;
                const backoffDelay = delay * 2 ** retries;
                await new Promise((resolve) => setTimeout(resolve, backoffDelay));
            }
        }

        throw new Error(`Failed to fetch ${url} after ${maxRetries} retries`);
    }

    for (const season of seasons) {
        const standingsUrl = `https://api.jolpi.ca/ergast/f1/${season}/drivers/${driverId}/driverStandings.json`;
        const polesUrl = `https://api.jolpi.ca/ergast/f1/${season}/drivers/${driverId}/qualifying/1.json`;

        let seasonData = {
            season: season.toString(),
            position: "N/A",
            points: "0",
            wins: "0",
            polePositions: "0",
        };

        try {
            // Fetch driver standings with backoff
            const standingsData = await fetchWithBackoff(standingsUrl);
            const standingsList = standingsData?.MRData?.StandingsTable?.StandingsLists?.[0];

            if (standingsList) {
                const driverStanding = standingsList.DriverStandings?.[0];
                if (driverStanding) {
                    seasonData.position = driverStanding.position || "N/A";
                    seasonData.points = driverStanding.points || "0";
                    seasonData.wins = driverStanding.wins || "0";
                }
            }
        } catch (error) {
            console.error(`Error fetching standings data for season ${season}:`, error);
        }

        try {
            // Fetch pole positions with backoff
            const polesData = await fetchWithBackoff(polesUrl);
            seasonData.polePositions = polesData?.MRData?.total || "0"; // Default to 0 if no data
        } catch (error) {
            console.error(`Error fetching poles data for season ${season}:`, error);
        }

        // Add season data to results
        results.push(seasonData);
    }

    return results;
}

