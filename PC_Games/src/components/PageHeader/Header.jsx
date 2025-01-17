import siteLogo from '../../assets/logo-no-background.svg';
import styles from './Header.module.css';
import React, { Component } from "react";

function Header() {

    const myFunction = () => {
        const x = document.getElementById("myTopnav");
        if (x) {
            x.classList.toggle(styles.responsive);
            document.body.style.overflow = x.classList.contains(styles.responsive) ? "hidden" : "scroll";
        }
    };

    return (
        <>
            <header>
                <div className={styles.Navibar}>
                    <div>
                        <img className={styles.siteLogo} src={siteLogo} />
                    </div>
                    <div className={styles.topnav} id="myTopnav">
                        <div className={styles.PagePaths}>
                            <a href="#Home">Home</a>
                            <a href="#Features">Features</a>
                            <a href="#Features">About</a>
                            <a className={styles.line}><div className={styles.lineDivider}></div></a>
                        </div>
                        <div className={styles.HomeButtons}>
                            <button className={`${styles.loginButton} ${styles.loginButton1}`}>Login</button>
                            <button className={`${styles.loginButton} ${styles.signupButton} ${styles.signupButton1} `}>Start for Free</button>
                        </div>
                    </div>
                    <a href="#" className={styles.icon} onClick={myFunction}>
                        <i className="fa fa-bars"></i>
                    </a>
                </div>
            </header>
        </>
    )
}


export default Header;