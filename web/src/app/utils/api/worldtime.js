"use client";

export async function timeNow() {
  const currentDateAPI = await fetch("http://worldtimeapi.org/api/ip");
  const currentData = await currentDateAPI.json();
  const currentDateTime = currentData.datetime;

  return new Date(currentDateTime);
}
