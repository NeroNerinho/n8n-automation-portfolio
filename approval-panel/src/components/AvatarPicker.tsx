"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AVAILABLE_AVATARS, useUser, type Avatar } from "@/contexts/UserContext";

const mainAvatarVariants: Variants = {
    initial: {
        y: 20,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
        },
    },
    exit: {
        y: -20,
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

const pickerVariants: Variants = {
    container: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    },
    item: {
        initial: {
            y: 20,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    },
};

const selectedVariants: Variants = {
    initial: {
        opacity: 0,
        rotate: -180,
    },
    animate: {
        opacity: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
        },
    },
    exit: {
        opacity: 0,
        rotate: 180,
        transition: {
            duration: 0.2,
        },
    },
};

export function AvatarPicker() {
    const { userAvatar, setUserAvatar } = useUser();
    const [rotationCount, setRotationCount] = useState(0);

    const handleAvatarSelect = (avatar: Avatar) => {
        setRotationCount((prev) => prev + 1080);
        setUserAvatar(avatar);
    };

    return (
        <motion.div initial="initial" animate="animate" className="w-full">
            <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-b from-background to-muted/30">
                <CardContent className="p-0">
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: "8rem",
                            transition: {
                                height: {
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 20,
                                },
                            },
                        }}
                        className="bg-gradient-to-r from-primary/20 to-primary/10 w-full"
                    />

                    <div className="px-8 pb-8 -mt-16">
                        <motion.div
                            className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 bg-background flex items-center justify-center"
                            variants={mainAvatarVariants}
                            layoutId="selectedAvatar"
                        >
                            <motion.div
                                className="w-full h-full flex items-center justify-center scale-[3]"
                                animate={{
                                    rotate: rotationCount,
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                            >
                                {userAvatar.svg}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="text-center mt-4"
                            variants={pickerVariants.item}
                        >
                            <motion.h2
                                className="text-2xl font-bold"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Me
                            </motion.h2>
                            <motion.p
                                className="text-muted-foreground text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Select your avatar
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="mt-6"
                            variants={pickerVariants.container}
                        >
                            <motion.div
                                className="flex justify-center gap-4"
                                variants={pickerVariants.container}
                            >
                                {AVAILABLE_AVATARS.map((avatar) => (
                                    <motion.button
                                        key={avatar.id}
                                        onClick={() =>
                                            handleAvatarSelect(avatar)
                                        }
                                        className={cn(
                                            "relative w-12 h-12 rounded-full overflow-hidden border-2",
                                            "transition-all duration-300"
                                        )}
                                        variants={pickerVariants.item}
                                        whileHover={{
                                            y: -2,
                                            transition: { duration: 0.2 },
                                        }}
                                        whileTap={{
                                            y: 0,
                                            transition: { duration: 0.2 },
                                        }}
                                        aria-label={`Select ${avatar.alt}`}
                                        aria-pressed={
                                            userAvatar.id === avatar.id
                                        }
                                    >
                                        <div className="w-full h-full flex items-center justify-center pointer-events-none">
                                            {avatar.svg}
                                        </div>
                                        {userAvatar.id === avatar.id && (
                                            <motion.div
                                                className="absolute inset-0 bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full"
                                                variants={selectedVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                layoutId="selectedIndicator"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
