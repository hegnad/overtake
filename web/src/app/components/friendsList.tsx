"use client";

import { useEffect, useState, useContext } from "react";
import { IdentityContext } from "../lib/context/identity";
import styles from "./friendsList.module.css"
import { getPrevRace } from "../utils/api/ergast";

interface FriendInfo {
    friendId: number;
    friendName: string;
}

interface FriendRequestInfo {
    inviteId: number;
    initiatorId: number;
    initiatorUsername: string;
}

interface UserInfo {
    userId: number;
    username: string;
}

interface FriendRequest {
    inviteeId: number;
    message: string;
}

export default function FriendsList() {
    const identity = useContext(IdentityContext);
    const [showFriends, setShowFriends] = useState(true);
    const [showRequests, setShowRequests] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [friends, setFriends] = useState<FriendInfo[]>([]);
    const [requests, setRequests] = useState<FriendRequestInfo[]>([]);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const fetchFriends = async () => {
            const response = await fetch("http://localhost:8080/api/friend/populate", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();

                setFriends(data);
                console.log(data);
                console.log(friends);
            } else {
                console.error(`non-successful status code: ${response.status}`)
            }
        };

        if(identity.sessionToken) {
            fetchFriends();
        }
    }, [identity.sessionToken]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            const response = await fetch("http://localhost:8080/api/friend/populateRequests", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();

                setRequests(data)
            } else {
                console.error(`non-successful status code: ${response.status}`)
            }
        };

        if(identity.sessionToken) {
            fetchFriendRequests();
        }
    }, [identity.sessionToken])

    useEffect (() => {
        const fetchUsers = async () => {
            const response = await fetch("http://localhost:8080/api/friend/populateUsers", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();

                setUsers(data)
            } else {
                console.error(`non-successful status code: ${response.status}`)
            }
        };

        if(identity.sessionToken) {
            fetchUsers();
        }
    }, [identity.sessionToken])

    const handleShowFriends = () => {
        setShowFriends(true);
        setShowRequests(false);
        setShowAdd(false);
    };

    const handleShowRequests = () => {
        setShowFriends(false);
        setShowRequests(true);
        setShowAdd(false);
    };

    const handleShowAdd = () => {
        setShowFriends(false);
        setShowRequests(false);
        setShowAdd(true);
    };

    const filteredUsers = users
        .filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);

    const handleUserSelect = (user: UserInfo) => {
        setSelectedUser(user);
    }

    const handleAddUser = async () => {
        if (selectedUser) {
            const requestBody: FriendRequest = {
                inviteeId: selectedUser.userId,
                message: "Let's be friends!",
            };

            try {
                const response = await fetch("http://localhost:8080/api/friend/createRequest", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${identity.sessionToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.status === 200) {
                    const newRequestId = await response.json();
                    console.log(`Friend request created with ID: ${newRequestId}`);
                    setSelectedUser(null); // Optionally reset selection
                } else {
                    console.error(`Failed to create friend request: ${response.status}`);
                }
            } catch (error) {
                console.error("Error creating friend request:", error);
            }
        }
    };

    const handleFriendInvite = async (inviteId: number, status: number) => {
        const response = await fetch("http://localhost:8080/api/friend/updateStatus", {
            method: "PUT",
                headers: {
                Authorization: `Bearer ${identity.sessionToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inviteId, status }),
        });

        if (response.status === 200) {
            setRequests((prevRequests) => prevRequests.filter((req) => req.inviteId !== inviteId));
        } else {
            console.error(`Failed to update request status: ${response.status}`);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <button onClick={handleShowFriends}>
                    Friends
                </button>
                <button onClick={handleShowRequests}>
                    Requests
                </button>
                <button onClick={handleShowAdd}>
                    Add
                </button>
            </div>
            {showFriends && (
                friends.length > 0 ? (
                    <ul className={styles.list}>
                        {friends.map((friend) => (
                            <li key={friend.friendId} className={styles.listItem}>
                                <button>
                                    {friend.friendName}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Friends List is Empty</p>
                )
            )}
            {showRequests && (
                requests.length > 0 ? (
                    <ul className={styles.list}>
                        {requests.map((request) => (
                            <li key={request.inviteId} className={styles.listItem}>
                                {request.initiatorUsername}
                                <button onClick={() => handleFriendInvite(request.inviteId, 1)}>V</button>
                                <button onClick={() => handleFriendInvite(request.inviteId, 2)}>X</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No Friend Requests</p>
                )
            )}
            {showAdd && (
                <div className={styles.addContainer}>
                   <input
                        type="text"
                        placeholder="Search by Username"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {filteredUsers.length > 0 ? (
                        <ul className={styles.list}>
                            {filteredUsers.map((user) => (
                                <li 
                                key={user.userId}
                                onClick={() => handleUserSelect(user)}
                                className={`${styles.listItem} ${selectedUser?.userId === user.userId ? styles.selectedItem : ''}`}
                                >
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No Users Found</p>
                    )}
                    {selectedUser && (
                        <button onClick={handleAddUser}>Add {selectedUser.username}</button>
                    )}
                </div>
            )}
        </div>
    )
}