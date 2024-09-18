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
    const raceTimeDate = new Date(`${raceDate}T${raceTime}`);
    const circuitLocation = `${raceInfo.Circuit.Location.locality}, ${raceInfo.Circuit.Location.country}`;

    return {
      raceName,
      circuitName,
      circuitLocation,
      raceTimeDate,
    };
  } catch (error) {
    console.error("Error fetching race data: ", error);
    return null;
  }
}
