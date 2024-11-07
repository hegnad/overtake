"use client";

import { IdentityContext } from "../lib/context/identity";
import { useState, useContext, useEffect, use } from "react";

export default function JoinWithCode() {
  const identity = useContext(IdentityContext);
  const [inviteCode, setInviteCode] = useState("");

  const handleJoinLeague = async () => {
    const response = await fetch(
      `http://localhost:8080/api/league/join/${inviteCode}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${identity.sessionToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: inviteCode }),
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error(`Failed to join league, status code: ${response.status}`);
    }
  };

  return (
    <div>
      <h1>Join a League</h1>
      <p>Enter the code provided by the league owner to join their league.</p>
      <input
        type="text"
        placeholder="Enter code"
        onChange={(e) => setInviteCode(e.target.value)}
      />
      <button onClick={handleJoinLeague}>Join League</button>
    </div>
  );
}
