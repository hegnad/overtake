'use client'

import {
    useEffect,
    useState,
} from "react";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "../home.module.css";


export default function RaceLeague() {

    const [ballot, setBallot] = useState(null);
    const [leagues, setLeagues] = useState(null);





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
                <div>
                    <div> {/*Your Race League(s)*/}
                        <div> {/*Individual Race Leagues*/}
                            
                        </div>
                    </div>
                    <div> {/*Your Grand Prix Ballot*/}
                        <div> {/*Podium drivers*/}
                            <div> {/*P2*/}
                            </div>
                            <div> {/*P1*/}
                            </div>
                            <div> {/*P3*/}
                            </div>
                            <div> {/*Status (on a roll etc.)*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </SidebarLayout>
    );
}
