"use client";

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "../home.module.css";
import CreateRaceLeague from "../components/createleague";
import UserRaceLeagues from "../components/userraceleagues";

export default function RaceLeague() {
  const identity = useContext(IdentityContext);
  const [ballots, setBallots] = useState<{position: number; driverId: string }[]>([]);

  useEffect(() => {
    const fetchBallot = async () => {
      const response = await fetch("http://localhost:8080/api/ballot/populate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${identity.sessionToken}`,
              "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        setBallots(data.map((ballot: { position: number; driverId: string}) => ballot));
      } else {
        console.error(`non-successful status code: ${response.status}`)
      }
    };

    if (identity.sessionToken) {
      fetchBallot();
    }
  }, [identity.sessionToken]);

  return (
    <SidebarLayout>
      <div className={styles.driversResults}>
        <CreateRaceLeague/>
        <UserRaceLeagues/>
        <div>
          <h2>Your Ballot</h2>
          <ul>
            {ballots.length > 0 ? (
              ballots.map((ballot, index) => (
              <li key={index}>
                Position: {ballot.position}, Driver ID: {ballot.driverId}
              </li>
            ))
          ) : (
            <p>No Ballots Found.</p>
          )}
          </ul>
        </div>
      </div>
    </SidebarLayout>
  );

  /*  ACTUAL PAGE LAYOUT
    return (
        <SidebarLayout>
            <div>
                <div>
                    <div>
                        <button>Create a Race League</button>
                    </div>
                    <div>
                        <button>Join a Race League</button>
                    </div>
                </div>
                <div>
                    <img
                        src="/images/yellowline.png"
                        alt="Yellow Line"
                        style={{ width: "100%" }}
                    />
                </div>
                <div>                                               */
  //                    <div> {/*Your Race League(s)*/}
  //                       <div> {/*Individual Race Leagues*/}

  //                       </div>
  //                    </div>
  //                   <div> {/*Your Grand Prix Ballot*/}
  //                       <div> {/*Podium drivers*/}
  //                            <div> {/*P2*/}
  //                           </div>
  //                            <div> {/*P1*/}
  //                            </div>
  //                            <div> {/*P3*/}
  //                            </div>
  //                            <div> {/*Status (on a roll etc.)*/}
  /*                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </SidebarLayout>
    );
*/
}
