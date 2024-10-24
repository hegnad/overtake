export async function getDriverHeadshot(driver_number) {
  const apiUrl = `http://localhost:8080/api/driver/headshot/${driver_number}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching driver image url: ", error);
    return null;
  }
}
