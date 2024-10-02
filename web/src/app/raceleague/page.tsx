"use client";

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect } from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "../home.module.css";
import CreateRaceLeague from "../components/createleague";
import UserRaceLeagues from "../components/userraceleagues";

export default function RaceLeague() {
  const identity = useContext(IdentityContext);
  const [ballot, setBallots] = useState<string[]>([]);

  useEffect(() => {
    const fetchBallot = async () => {
      //const response = await fetch()
    }
  })

  return (
    <SidebarLayout>
      <div className={styles.driversResults}>
        <CreateRaceLeague/>
        <UserRaceLeagues/>
        <div>
          <h2>Your Ballot</h2>

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
