"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6 bg-transparent"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <div className="p-10 rounded-3xl border border-zinc-800 shadow-lg shadow-sky-500/10 max-w-xs w-full bg-zinc-900/50" key={i}>
                                    <div className="text-zinc-300 text-sm leading-relaxed">{text}</div>
                                    <div className="flex items-center gap-2 mt-5">
                                        <img
                                            width={40}
                                            height={40}
                                            src={image}
                                            alt={name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <div className="font-medium tracking-tight leading-5 text-white">{name}</div>
                                            <div className="leading-5 text-zinc-500 tracking-tight text-sm">{role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.div>
        </div>
    );
};

export default TestimonialsColumn;