"use client";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./style.module.scss";
import React, { useState } from "react";
import Button from "./button/index";
import MenuNav from "./menu-nav/index";

const menu = {
  open: {
    width: "100%",
    height: "450px",
    top: "-15px",
    right: "-15px",
    transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    width: "100px",
    height: "40px",
    top: "0px",
    right: "0px",
    transition: {
      duration: 0.75,
      delay: 0.35,
      type: "tween",
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export default function HamburgerMenu() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`${styles.header} ${"md:hidden"}`}>
      <motion.div
        className={styles.menu}
        variants={menu}
        animate={isActive ? "open" : "closed"}
        initial="closed"
      >
        <AnimatePresence>{isActive && <MenuNav />}</AnimatePresence>
      </motion.div>
      <Button isActive={isActive} toggleMenu={() => setIsActive(!isActive)} />
    </div>
  );
}
