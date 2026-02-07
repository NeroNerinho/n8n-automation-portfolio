"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Avatar {
    id: number;
    svg: React.ReactNode;
    alt: string;
}

// Default avatars definition (moved here to be shared)
export const AVAILABLE_AVATARS: Avatar[] = [
    {
        id: 1,
        svg: (
            <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-label="Avatar 1">
                <mask id=":r111:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF" /></mask>
                <g mask="url(#:r111:)">
                    <rect width="36" height="36" fill="#ff005b" />
                    <rect x="0" y="0" width="36" height="36" transform="translate(9 -5) rotate(219 18 18) scale(1)" fill="#ffb238" rx="6" />
                    <g transform="translate(4.5 -4) rotate(9 18 18)">
                        <path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round" />
                        <rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" />
                        <rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 1",
    },
    {
        id: 2,
        svg: (
            <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <mask id=":R4mrttb:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask>
                <g mask="url(#:R4mrttb:)">
                    <rect width="36" height="36" fill="#ff7d10"></rect>
                    <rect x="0" y="0" width="36" height="36" transform="translate(5 -1) rotate(55 18 18) scale(1.1)" fill="#0a0310" rx="6" />
                    <g transform="translate(7 -6) rotate(-5 18 18)">
                        <path d="M15 20c2 1 4 1 6 0" stroke="#FFFFFF" fill="none" strokeLinecap="round" />
                        <rect x="14" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" />
                        <rect x="20" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 2",
    },
    {
        id: 3,
        svg: (
            <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <mask id=":r11c:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask>
                <g mask="url(#:r11c:)">
                    <rect width="36" height="36" fill="#0a0310" />
                    <rect x="0" y="0" width="36" height="36" transform="translate(-3 7) rotate(227 18 18) scale(1.2)" fill="#ff005b" rx="36" />
                    <g transform="translate(-3 3.5) rotate(7 18 18)">
                        <path d="M13,21 a1,0.75 0 0,0 10,0" fill="#FFFFFF" />
                        <rect x="12" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" />
                        <rect x="22" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 3",
    },
    {
        id: 4,
        svg: (
            <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <mask id=":r1gg:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask>
                <g mask="url(#:r1gg:)">
                    <rect width="36" height="36" fill="#d8fcb3"></rect>
                    <rect x="0" y="0" width="36" height="36" transform="translate(9 -5) rotate(219 18 18) scale(1)" fill="#89fcb3" rx="6" ></rect>
                    <g transform="translate(4.5 -4) rotate(9 18 18)">
                        <path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round" ></path>
                        <rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" ></rect>
                        <rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" ></rect>
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 4",
    },
];

interface UserContextType {
    userAvatar: Avatar;
    setUserAvatar: (avatar: Avatar) => void;
    userName: string;
    setUserName: (name: string) => void;
    userEmail: string;
    setUserEmail: (email: string) => void;
    userRole: string;
    setUserRole: (role: string) => void;
    userBio: string;
    setUserBio: (bio: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [userAvatar, setUserAvatar] = useState<Avatar>(AVAILABLE_AVATARS[0]);
    const [userName, setUserName] = useState("Usuário");
    const [userEmail, setUserEmail] = useState("usuario@grupoom.com");
    const [userRole, setUserRole] = useState("Viewer");
    const [userBio, setUserBio] = useState("");

    // Persist to local storage if needed
    useEffect(() => {
        const savedAvatarId = localStorage.getItem("user_avatar_id");
        if (savedAvatarId) {
            const found = AVAILABLE_AVATARS.find(a => a.id === parseInt(savedAvatarId));
            if (found) setUserAvatar(found);
        }

        const savedName = localStorage.getItem("user_name");
        if (savedName) setUserName(savedName);

        const savedEmail = localStorage.getItem("user_email");
        if (savedEmail) setUserEmail(savedEmail);

        const savedRole = localStorage.getItem("user_role");
        if (savedRole) setUserRole(savedRole);

        const savedBio = localStorage.getItem("user_bio");
        if (savedBio) setUserBio(savedBio);
    }, []);

    const updateAvatar = (avatar: Avatar) => {
        setUserAvatar(avatar);
        localStorage.setItem("user_avatar_id", avatar.id.toString());
    };

    const updateName = (name: string) => {
        setUserName(name);
        localStorage.setItem("user_name", name);
        // Sync with AuthContext or other stores if necessary
    };

    const updateEmail = (email: string) => {
        setUserEmail(email);
        localStorage.setItem("user_email", email);
    }

    const updateRole = (role: string) => {
        setUserRole(role);
        localStorage.setItem("user_role", role);
    }

    const updateBio = (bio: string) => {
        setUserBio(bio);
        localStorage.setItem("user_bio", bio);
    }

    return (
        <UserContext.Provider value={{
            userAvatar,
            setUserAvatar: updateAvatar,
            userName,
            setUserName: updateName,
            userEmail,
            setUserEmail: updateEmail,
            userRole,
            setUserRole: updateRole,
            userBio,
            setUserBio: updateBio
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
