import React, { useState } from "react";
import styles from "./SideNav.module.css";

function SideNav(props) {
    const [isExpanded, setIsExpanded] = useState(false); // Manage sidebar expand/collapse
    const [selectedFilters, setSelectedFilters] = useState({}); // Track selected filter values
    const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
    const setToggleSideNavbar = props.setToggleSideNavbar;
    const handleAddGenre = props.handleAddGenre;
    const clearAllCriteria = props.clearAllCriteria;
    const handleAddPlatform = props.handleAddPlatform;
    const handleSetPrice = props.handleSetPrice;
    const handleSetBeforeDate = props.handleSetBeforeDate;
    // Toggle sidebar expansion
    const toggleSideNav = () => {
        setIsExpanded(!isExpanded);
        setToggleSideNavbar((prev)=>!prev);
    }

    // Handle checkbox selection
    const handleCheckboxChange = (category, value) => {
        setSelectedFilters((prevFilters) => {
            const updatedCategory = prevFilters[category] || [];
            if (updatedCategory.includes(value)) {
                // Remove the value if already selected
                return {
                    ...prevFilters,
                    [category]: updatedCategory.filter((item) => item !== value),
                };
            } else {
                // Add the value if not already selected
                return {
                    ...prevFilters,
                    [category]: [...updatedCategory, value],
                };
            }
        });
    };

    // Handle single filter submission when double-clicking on dropdown category title
    const handleSingleFilterSubmit = (category) => {
        console.log("Single Filter submitted: ", { [category]: selectedFilters[category] || [] });
        // Add single filter submission logic here
    };

    // Toggle dropdown open/close while retaining selected checkboxes
    const toggleDropdown = (category) => {
        setOpenDropdown(openDropdown === category ? null : category);
    };

    // Handle "Go" button submission
    const handleSubmit = () => {
        console.log("Filters submitted: ", selectedFilters);
    
        // Check if all fields are empty or not selected
        const noFiltersSelected =
            (!selectedFilters.Genre || selectedFilters.Genre.length === 0) &&
            (!selectedFilters.Platform || selectedFilters.Platform.length === 0) &&
            (!selectedFilters.Date || selectedFilters.Date.length === 0) &&
            (!selectedFilters.Price || selectedFilters.Price.length === 0);
    
        if (noFiltersSelected) {
            // Invoke clearAllCriteria if no filters are selected
            console.log("No filters selected, clearing all criteria...");
            clearAllCriteria();
            return;
        }
    
        // Helper to calculate max date difference
        const getDateFromLabel = (label) => {
            const currentDate = new Date();
            switch (label) {
                case "Last 7 Days":
                    // console.log("7 days date : " , new Date(currentDate.setDate(currentDate.getDate() - 7)));
                    return new Date(currentDate.setDate(currentDate.getDate() - 7));
                case "Last 30 Days":
                    return new Date(currentDate.setDate(currentDate.getDate() - 30));
                case "Last 6 Months":
                    return new Date(currentDate.setMonth(currentDate.getMonth() - 6));
                case "Last Year":
                    return new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
                default:
                    return null;
            }
        };
    
        // Helper to calculate max price
        const getPriceFromLabel = (label) => {
            switch (label) {
                case "Free":
                    return -1;
                case "Under $5":
                    return 5;
                case "Under $10":
                    return 10;
                case "Premium":
                    return 3000;
                default:
                    return null;
            }
        };
    
        // Process Genre
        if (selectedFilters.Genre?.length) {
            console.log("Processing genres: ", selectedFilters.Genre);
            handleAddGenre(selectedFilters.Genre);
        } else if (!(selectedFilters.Genre?.length)) {
            handleAddGenre([]);
        }

        // Process Platform
        if (selectedFilters.Platform?.length) {
            console.log("Processing platforms: ", selectedFilters.Platform);
            handleAddPlatform(selectedFilters.Platform);
        } else if (!(selectedFilters.Platform?.length)) {
            handleAddPlatform([]);
        }

        // Process Price: Select the maximum value from the list
        if (selectedFilters.Price?.length) {
            const maxPrice = Math.max(...selectedFilters.Price.map(getPriceFromLabel));
            console.log("Setting maximum price filter: ", maxPrice);
            handleSetPrice(maxPrice);
        } else if (!(selectedFilters.Price?.length)) {
            handleSetPrice(null);
        }
    
        if (selectedFilters.Date?.length) {
            const minDate = selectedFilters.Date.reduce((earliestDate, currentLabel) => {
                const currentDate = getDateFromLabel(currentLabel);
                console.log("The earliestDate : ", earliestDate, " | currentLabel : ", currentDate);
                return currentDate < earliestDate ? currentDate : earliestDate;
            }, new Date()); // Start with the current date
            console.log("Setting date filter to: ", minDate);
            handleSetBeforeDate(minDate);
        } else if (!(selectedFilters.Date?.length)) {
            handleSetBeforeDate(null);
        }
    };
    

    // Handle "Clear All Filters" icon
    const handleClearAll = () => {
        setSelectedFilters({}); // Reset all selected filters
        clearAllCriteria();
        console.log("All filters cleared.");
    };

    const dropdownData = {
        Genre: ["Action", "Adventure", "Strategy", "Puzzle", "Other"],
        Platform: ["Windows", "macOS", "Linux", "Android", "Other"],
        Date: ["Last 7 Days", "Last 30 Days", "Last 6 Months", "Last Year"],
        Price: ["Free", "Under $5", "Under $10", "Premium"],
    };

    return (
        <div
            className={`${styles.sideNav} ${
                isExpanded ? styles.expanded : styles.collapsed
            }`}
        >
            <div className={styles.header}>
                <h3>{isExpanded ? "Filters" : ""}</h3>
                <button className={styles.hamburger} onClick={toggleSideNav}>
                    <i className="fa fa-bars"></i>
                </button>
                {isExpanded && (
                    <>
                        <button className={styles.goButton} onClick={handleSubmit}>
                            Go
                        </button>
                        <i
                            className={`fa fa-trash ${styles.clearIcon}`}
                            onClick={handleClearAll}
                            title="Clear all filters"
                        ></i>
                    </>
                )}
            </div>
            {isExpanded &&
                Object.keys(dropdownData).map((category) => (
                    <div key={category} className={styles.dropdown}>
                        {/* Dropdown title */}
                        <button
                            className={styles.dropdownButton}
                            onClick={() => toggleDropdown(category)}
                            onDoubleClick={() => handleSingleFilterSubmit(category)}
                        >
                            {category} <i className="fa fa-caret-down"></i>
                        </button>
                        {/* Dropdown values */}
                        {openDropdown === category && (
                            <div className={styles.dropdownValues}>
                                {dropdownData[category].map((value, index) => (
                                    <label key={index} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            value={value}
                                            checked={selectedFilters[category]?.includes(value) || false}
                                            onChange={() => handleCheckboxChange(category, value)}
                                        />
                                        {value}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}

export default SideNav;
