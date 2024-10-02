"use client"

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";

export default function UserRaceLeagues() {
    const identity = useContext(IdentityContext);
    const [leagues, setLeagues] = useState<string[]>([]);

    useEffect(() => {
        const fetchLeagues = async () => {
          const response = await fetch("http://localhost:8080/api/league/populate", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${identity.sessionToken}`,
              "Content-Type": "application/json",
            },
          });
    
          if (response.status === 200) {
            const data = await response.json();
            
            setLeagues(data.map((league: { name: string }) => league.name));
          } else {
            console.error(`non-successful status code: ${response.status}`)
          }
        };
    
        if (identity.sessionToken) {
          fetchLeagues();
        }
      }, [identity.sessionToken]);

    return (
        <div>
            <h2>Your Leagues</h2>
          <ul>
            {leagues.length > 0 ? (
              leagues.map((leagueName, index) => (
                <li key={index}>{leagueName}</li>
              ))
            ) : (
              <p>No Leagues Found.</p>
            )}
          </ul>
        </div>
    );
}