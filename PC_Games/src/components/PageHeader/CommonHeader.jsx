import { useNavigate } from 'react-router-dom';
import siteLogo from '../../assets/Common_logo-removebg.png';
import styles from './CommonHeader.module.css';
import React, { useState, useEffect, useRef } from "react";

function CommonHeader(props) {
    const loggedInUserName = props.loggedInUserName || "PC";
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // Reference to the dropdown element
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const closeDropdown = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownVisible(false); // Close the dropdown if clicked outside
        }
    };

    const handleClickBrowse = () =>{
        console.log("Navigating to browse page ...");
        navigate("/BrowseGames");
    }

    const handleLogout = () => {
        console.log("Logging out");
        navigate("/");
    }

    const handleClickDashboard = () =>{
        console.log("Navigating to own Dashboard page ...");
        // navigate("/DashboardPage",{
        navigate("/HomePage",{                  // To got to HomePage
            state:{userName:loggedInUserName , loggedInUserName:loggedInUserName}
        });
    }

    const handleClickAbout = () => {
        console.log("Navigating to Product about page ...");
        // navigate("/AboutPage");
    }

    const handleClickProfile = () => {
        console.log("Navigating to Profile page ...");
        navigate("/UserProfile", {
            state:{loggedInUserName:loggedInUserName}
        });
    }

    useEffect(() => {
        if (isDropdownVisible) {
            document.addEventListener("mousedown", closeDropdown);
        } else {
            document.removeEventListener("mousedown", closeDropdown);
        }
        // Clean up the event listener
        return () => {
            document.removeEventListener("mousedown", closeDropdown);
        };
    }, [isDropdownVisible]);

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
                        <img className={styles.siteLogo} src={siteLogo} alt="Site Logo" />
                    </div>
                    <div className={styles.topnav} id="myTopnav">
                        <div className={styles.PagePaths}>
                            <a onClick={handleClickBrowse}>Browse</a>
                            <a onClick={handleClickDashboard}>Dashboard</a>
                            <a onClick={handleClickAbout}>About</a>
                            <a className={styles.line}><div className={styles.lineDivider}></div></a>
                        </div>
                        <div className={styles.userProfileName} ref={dropdownRef}>
                            <h3 onClick={toggleDropdown}>{loggedInUserName}</h3>
                            {isDropdownVisible && (
                                <div className={styles.dropdown}>
                                    <a onClick={handleClickProfile}>Profile</a>
                                    <a href="#Settings">Settings</a>
                                    <a href="" onClick={handleLogout}>Log Out</a>
                                </div>
                            )}
                        </div>
                    </div>
                    <a href="#" className={styles.icon} onClick={myFunction}>
                        <i className="fa fa-bars"></i>
                    </a>
                </div>
            </header>
        </>
    );
}

export default CommonHeader;