"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from "react";
import { IdentityContext } from "../lib/context/identity";
import styles from "./friendsList.module.css"

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

interface LeagueInfo {
    leagueId: number;
    ownerId: number;
    name: string;
    isPublic: boolean;
}

interface LeagueInviteInfo {
    inviteId: number;
    leagueId: number;
    leagueName: string;
}

export default function FriendsList() {
    const identity = useContext(IdentityContext);
    const router = useRouter();

    const [showFriends, setShowFriends] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [showInvites, setShowInvites] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showLeagues, setShowLeagues] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [friends, setFriends] = useState<FriendInfo[]>([]);
    const [requests, setRequests] = useState<FriendRequestInfo[]>([]);
    const [invites, setInvites] = useState<LeagueInviteInfo[]>([]);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [leagues, setLeagues] = useState<LeagueInfo[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<FriendRequestInfo | null>(null);
    const [selectedInvite, setSelectedInvite] = useState<LeagueInviteInfo | null>(null);
    const [selectedFriend, setSelectedFriend] = useState<FriendInfo | null>(null);
    const [selectedLeague, setSelectedLeague] = useState<LeagueInfo | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

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
        } else {
            console.error(`non-successful status code: ${response.status}`);
        }
    };

    useEffect(() => {
        if (identity.sessionToken) {
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

    const fetchLeagues = async (inviteeId: number) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/friend/populateLeagues?inviteeId=${inviteeId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${identity.sessionToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                const data = await response.json();
                setLeagues(data);
            } else {
                console.error(`Non-successful status code: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching leagues:", error);
        }
    };

    // Call this method when showLeagues becomes true
    useEffect(() => {
        if (showLeagues && selectedFriend?.friendId && identity.sessionToken) {
            fetchLeagues(selectedFriend.friendId);
        }
    }, [showLeagues, selectedFriend?.friendId, identity.sessionToken]);

    useEffect(() => {
        const fetchInvites = async () => {
            const response = await fetch(
                "http://localhost:8080/api/league/populateInvites",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${identity.sessionToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                const data = await response.json();
                setInvites(data);
            } else {
                console.error(`non-successful status code: ${response.status}`);
            }
        };

        if (identity.sessionToken) {
            fetchInvites();
        }
    }, [identity.sessionToken]);

    const resetSelections = () => {
        setSelectedRequest(null);
        setSelectedInvite(null);
        setSelectedFriend(null);
        setSelectedLeague(null);
        setSelectedUser(null);
    };

    const handleShowFriends = () => {
        resetSelections();
        setShowFriends(true);
        setShowNotifications(false);
        setShowRequests(false);
        setShowInvites(false);
        setShowAdd(false);
        setShowLeagues(false);
    };

    const handleShowRequests = () => {
        resetSelections();
        setShowFriends(false);
        setShowNotifications(true);
        setShowRequests(true);
        setShowInvites(false);
        setShowAdd(false);
        setShowLeagues(false);
    };

    const handleShowAdd = () => {
        resetSelections();
        setShowFriends(false);
        setShowNotifications(false);
        setShowRequests(false);
        setShowInvites(false);
        setShowAdd(true);
        setShowLeagues(false);
    };

    const handleShowLeagues = () => {
        setShowFriends(false);
        setShowNotifications(false);
        setShowRequests(false);
        setShowInvites(false);
        setShowAdd(false);
        setShowLeagues(true);
    };

    const filteredUsers = users
        .filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);

    const handleUserSelect = (user: UserInfo) => {
        setSelectedUser(user);
    };

    const handleRequestSelect = (request: FriendRequestInfo) => {
        setSelectedRequest(request);
    };

    const handleInviteSelect = (invite: LeagueInviteInfo) => {
        setSelectedInvite(invite);
    }

    const handleFriendSelect = (friend: FriendInfo) => {
        setSelectedFriend(friend);
    };

    const handleLeagueSelect = (league: LeagueInfo) => {
        setSelectedLeague(league);
    };

    const handleViewProfile = (friendId: number) => {
        sessionStorage.setItem("profileUserId", friendId.toString());
        router.push("/profile")
    };

    const handleInviteToLeague = async (leagueId: number, inviteeId: number) => {
        try {
            const response = await fetch("http://localhost:8080/api/league/invite", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${identity.sessionToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    leagueId,
                    inviteeId,
                }),
            });

            if (response.status === 200) {
                setConfirmationMessage(`Invite to ${selectedFriend?.friendName} sent successfully.`);
                resetSelections();
                setShowLeagues(false);
            } else {
                setConfirmationMessage("Failed to send invite.");
            }
        } catch (error) {
            setConfirmationMessage("Error creating league invite.");
        }
    };

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
                    setConfirmationMessage(`Friend request sent to ${selectedUser.username}.`);
                    setSelectedUser(null);
                } else {
                    setConfirmationMessage("Failed to send friend request.");
                }
            } catch (error) {
                setConfirmationMessage("Error creating friend request.");
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
            setConfirmationMessage(status === 1 ? "Friend request accepted." : "Friend request declined.");
            setRequests((prevRequests) => prevRequests.filter((req) => req.inviteId !== inviteId));
            setSelectedRequest(null);

            // Refetch friends list if the request was accepted
            if (status === 1) {
                await fetchFriends();
            }
        } else {
            setConfirmationMessage("Failed to update request status.");
        }
    };

    const handleLeagueInvite = async (inviteId: number, status: number) => {
        const response = await fetch("http://localhost:8080/api/league/updateStatus", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${identity.sessionToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inviteId, status }),
        });

        if (response.status === 200) {
            setConfirmationMessage(status === 1 ? "League invite accepted." : "League invite declined.");
            setInvites((prevInvites) => prevInvites.filter((req) => req.inviteId !== inviteId));
            setSelectedInvite(null);
        } else {
            setConfirmationMessage("Failed to update invite status.");
        }
    };

    return (
        <div className={styles.container}>
            {confirmationMessage ? (
                <div className={styles.overlay}>
                    <div className={styles.confirmationMessage}>
                        <p>{confirmationMessage}</p>
                        <button onClick={() => setConfirmationMessage(null)}>Close</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.buttonContainer}>
                        <button onClick={handleShowFriends}>Friends</button>
                        <button onClick={handleShowRequests}>Requests</button>
                        <button onClick={handleShowAdd}>Add</button>
                    </div>

                    {/* Friends tab with red outline */}
                    {showFriends && (
                        <div className={styles.addContainer}>
                            {friends.length > 0 ? (
                                <ul className={`${styles.list} ${styles.friendsList}`}>
                                    {friends.map((friend) => (
                                        <li
                                            key={friend.friendId}
                                            onClick={() => handleFriendSelect(friend)}
                                            className={`${styles.listItem} ${selectedFriend?.friendId === friend.friendId ? styles.selectedItem : ''}`}
                                        >
                                            {friend.friendName}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No Friends Found</p>
                            )}
                            {selectedFriend && !showLeagues && (
                                <div className={styles.buttonSection}>
                                    <button onClick={() => handleViewProfile(selectedFriend.friendId)}>View Profile</button>
                                    <button onClick={handleShowLeagues}>Invite to League</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Leagues selection for inviting a friend with red outline */}
                    {showLeagues && (
                        <div className={styles.addContainer}>
                            {leagues.length > 0 ? (
                                <ul className={`${styles.list} ${styles.leaguesList}`}>
                                    {leagues.map((league) => (
                                        <li
                                            key={league.leagueId}
                                            onClick={() => handleLeagueSelect(league)}
                                            className={`${styles.listItem} ${selectedLeague?.leagueId === league.leagueId ? styles.selectedItem : ''}`}
                                        >
                                            {league.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No Leagues Found</p>
                            )}
                            {selectedLeague && selectedFriend && (
                                <div className={styles.buttonSection}>
                                    <button onClick={() => handleInviteToLeague(selectedLeague.leagueId, selectedFriend.friendId)}>
                                        Invite to {selectedLeague.name}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notifications tab with red outline */}
                    {showNotifications && (
                        <div className={styles.addContainer}>
                            <div className={styles.filterButtonContainer}>
                                <button
                                    onClick={() => { setShowRequests(true); setShowInvites(false); }}
                                    className={showRequests ? styles.activeButton : ''}
                                >
                                    Friend
                                </button>
                                <button
                                    onClick={() => { setShowInvites(true); setShowRequests(false); }}
                                    className={showInvites ? styles.activeButton : ''}
                                >
                                    League
                                </button>
                            </div>

                            {showRequests && (
                                requests.length > 0 ? (
                                    <ul className={`${styles.list} ${styles.requestsList}`}>
                                        {requests.map((request) => (
                                            <li
                                                key={request.inviteId}
                                                onClick={() => handleRequestSelect(request)}
                                                className={`${styles.listItem} ${selectedRequest?.inviteId === request.inviteId ? styles.selectedItem : ''}`}
                                            >
                                                {request.initiatorUsername}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No Friend Requests</p>
                                )
                            )}

                            {showInvites && (
                                invites.length > 0 ? (
                                    <ul className={`${styles.list} ${styles.invitesList}`}>
                                        {invites.map((invite) => (
                                            <li
                                                key={invite.inviteId}
                                                onClick={() => handleInviteSelect(invite)}
                                                className={`${styles.listItem} ${selectedInvite?.inviteId === invite.inviteId ? styles.selectedItem : ''}`}
                                            >
                                                {invite.leagueName}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No League Invites</p>
                                )
                            )}
                            {selectedRequest && (
                                <div className={styles.buttonSection}>
                                    <button onClick={() => handleFriendInvite(selectedRequest.inviteId, 1)}>Accept</button>
                                    <button onClick={() => handleFriendInvite(selectedRequest.inviteId, 2)}>Decline</button>
                                </div>
                            )}

                            {selectedInvite && (
                                <div className={styles.buttonSection}>
                                    <button onClick={() => handleLeagueInvite(selectedInvite.inviteId, 1)}>Accept</button>
                                    <button onClick={() => handleLeagueInvite(selectedInvite.inviteId, 2)}>Decline</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Add tab for adding new friends */}
                    {showAdd && (
                        <div className={styles.addContainer}>
                            <input
                                type="text"
                                placeholder="Search by Username"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ color: "black" }}
                            />
                            {filteredUsers.length > 0 ? (
                                <ul className={`${styles.list} ${styles.addList}`}>
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
                                <div className={styles.buttonSection}>
                                    <button onClick={handleAddUser}>
                                        Add {selectedUser.username}
                                    </button>
                                    <button onClick={() => handleViewProfile(selectedUser.userId)}>
                                        View {selectedUser.username}&apos;s Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}