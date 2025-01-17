import React, { useEffect, useState } from "react";
import styles from "./PopupForm.module.css";

function PopupForm(props) {
    // To reset the Game Genre selected
    const isPopupVisible = props.isPopupVisible;
    const setpopupDiv = props.setpopupDiv;
    const formData = props.formData || {};
    const setFormData = props.setFormData;
    const resetFormData = props.resetFormData;
    const handleSubmit = props.handleSubmit;
    const handleChange = props.handleChange;
    const handleFileChange = props.handleFileChange;
    const fileInputRefs = props.fileInputRefs || { current: {} };

    const [genreList, setGenreList] = useState(["Action", "Adventure", "Strategy", "Puzzle", "Other"]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [gamePlatForm, setGamePlatForm] = useState(["Windows", "macOS", "Linux", "Android"]);
    const [selectedGamePlateForms, setSelectedGamePlateForms] = useState([]);

    const closeDiv = () => {
        const popupDiv = document.getElementById("popupDivID");
        const mainPage = document.getElementById("mainPageId");

        if (popupDiv) popupDiv.style.animation = "popupAnimationClose 0.5s linear";
        if (mainPage) mainPage.style.webkitFilter = "blur(0px)";
        document.body.style.overflowY = "scroll";

        if (resetFormData) resetFormData();
        if (setpopupDiv) setpopupDiv(0);
        setSelectedGenres([]);
        setGenreList(["Action", "Adventure", "Strategy", "Puzzle", "Other"]);
    };

    const renderPreview = (file) => {
        return file ? <img src={URL.createObjectURL(file)} alt="Preview" className={styles.imagePreview} /> : <p>No file selected</p>;
    };

    const handleGenreSelect = (genre) => {
        setSelectedGenres((prev) => [...prev, genre]);
        setGenreList((prev) => prev.filter((item) => item !== genre));
    };

    const removeSelectedGenre = (genre) => {
        setSelectedGenres((prev) => prev.filter((item) => item !== genre));
        setGenreList((prev) => [...prev, genre]);
    };

    const handleGamePlatformSelect = (platform) => {
        setSelectedGamePlateForms((prev) => [...prev , platform]);
        setGamePlatForm((prev) => prev.filter((item)=> item !== platform));
    }

    const removeSelectedPlatform = (platform) => {
        setSelectedGamePlateForms((prev) => prev.filter((item)=> item !== platform));
        setGamePlatForm((prev) => [...prev , platform]);
    }

        // To reset the Game Genre selected
    useEffect(()=>{
        setSelectedGenres([]);
        setGenreList(["Action", "Adventure", "Strategy", "Puzzle", "Other"]);
    },[isPopupVisible]);

    return (
        <div>
            <div id="popupDivID" className={styles.popupDiv}>
                <span onClick={closeDiv} className={styles.closeButton}>&#10006;</span>
                <form onSubmit={(e) => handleSubmit(e, String(selectedGenres), String(selectedGamePlateForms))} className={styles.popupForm}>
                    <div className={styles.formContainer}>
                        {/* Left Section */}
                        <div className={styles.leftSection}>
                            {/* Game Cover Image */}
                            <label className={styles.formLabel} htmlFor="gameCoverImage">Game Cover Image:</label>
                            <div className={styles.previewContainer}>{renderPreview(formData.gameCoverImage)}</div>
                            <input
                                className={styles.formInput}
                                type="file"
                                id="gameCoverImage"
                                name="gameCoverImage"
                                accept="image/*"
                                ref={(input) => fileInputRefs?.current && (fileInputRefs.current["gameCoverImage"] = input)}
                                onChange={(e) => handleFileChange(e, "gameCoverImage")}
                            />

                            {/* Game Screenshots */}
                            <label className={styles.formLabel} htmlFor="gameFirstSs">Game First Screenshot:</label>
                            <div className={styles.previewContainerHalf}>{renderPreview(formData.gameFirstSs)}</div>
                            <input
                                className={styles.formInput}
                                type="file"
                                id="gameFirstSs"
                                name="gameFirstSs"
                                accept="image/*"
                                ref={(input) => fileInputRefs?.current && (fileInputRefs.current["gameFirstSs"] = input)}
                                onChange={(e) => handleFileChange(e, "gameFirstSs")}
                            />

                            <label className={styles.formLabel} htmlFor="gameSecondSs">Game Second Screenshot:</label>
                            <div className={styles.previewContainerHalf}>{renderPreview(formData.gameSecondSs)}</div>
                            <input
                                className={styles.formInput}
                                type="file"
                                id="gameSecondSs"
                                name="gameSecondSs"
                                accept="image/*"
                                ref={(input) => fileInputRefs?.current && (fileInputRefs.current["gameSecondSs"] = input)}
                                onChange={(e) => handleFileChange(e, "gameSecondSs")}
                            />
                        </div>

                        {/* Right Section */}
                        <div className={styles.rightSection}>
                            <label className={styles.formLabel} htmlFor="gameName">Game Name:</label>
                            <input
                                className={styles.formInput}
                                type="text"
                                id="gameName"
                                name="gameName"
                                placeholder="Enter Game Name"
                                value={formData.gameName}
                                onChange={handleChange}
                                required
                            />
                            <label className={styles.formLabel} htmlFor="gameDescription">Game Description:</label>
                            <textarea
                                className={styles.formTextarea}
                                placeholder="Enter Game Description"
                                name="gameDescription"
                                value={formData.gameDescription}
                                onChange={handleChange}
                            ></textarea>
                            <label className={styles.formLabel} htmlFor="gameInstallInstruc">Game Installation Steps:</label>
                            <textarea
                                className={styles.formTextarea}
                                placeholder="Enter Installation Steps"
                                name="gameInstallInstruc"
                                value={formData.gameInstallInstruc}
                                onChange={handleChange}
                            ></textarea>
                            <label className={styles.formLabel} htmlFor="gameVideoLink">Game Video Link:</label>
                            <input
                                className={styles.formInput}
                                type="text"
                                id="gameVideoLink"
                                name="gameVideoLink"
                                placeholder="Enter Game Video Link"
                                value={formData.gameVideoLink}
                                onChange={handleChange}
                            />

                            {/* Game Genre */}
                            <label className={styles.formLabel} htmlFor="gameGenre">Game Genre:</label>
                            <div className={styles.genreContainer}>
                                <div className={styles.selectedGenres}>
                                    {selectedGenres.map((genre) => (
                                        <span
                                            key={genre}
                                            className={styles.genreBadge}
                                            onClick={() => removeSelectedGenre(genre)}
                                        >
                                            {genre} &#10006;
                                        </span>
                                    ))}
                                </div>
                                <div className={styles.genreList}>
                                    {genreList.map((genre) => (
                                        <span
                                            key={genre}
                                            className={styles.genreOption}
                                            onClick={() => handleGenreSelect(genre)}
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Game Platform */}
                            <label className={styles.formLabel} htmlFor="gamePlatform">Game Platforms:</label>
                            <div className={styles.genreContainer}>
                                <div className={styles.selectedGenres}>
                                    {selectedGamePlateForms.map((platform) => (
                                        <span
                                            key={platform}
                                            className={styles.genreBadge}
                                            onClick={() => removeSelectedPlatform(platform)}
                                        >
                                            {platform === "Windows" && <i style={{fontSize:"13px"}} className="fa fa-windows"></i>}
                                            {platform === "macOS" && <i style={{fontSize:"13px"}} className="fa fa-apple"></i>}
                                            {platform === "Linux" && <i style={{fontSize:"13px"}} className="fa fa-linux"></i>}
                                            {platform === "Android" && <i style={{fontSize:"13px"}} className="fa fa-android"></i>} &#10006;
                                        </span>
                                    ))}
                                </div>
                                <div className={styles.genreList}>
                                    {gamePlatForm.map((platform) => (
                                        <span
                                            key={platform}
                                            className={styles.genreOption}
                                            onClick={() => handleGamePlatformSelect(platform)}
                                        >
                                            {platform === "Windows" && <i style={{fontSize:"13px"}} className="fa fa-windows"></i>}
                                            {platform === "macOS" && <i style={{fontSize:"13px"}} className="fa fa-apple"></i>}
                                            {platform === "Linux" && <i style={{fontSize:"13px"}} className="fa fa-linux"></i>}
                                            {platform === "Android" && <i style={{fontSize:"13px"}} className="fa fa-android"></i>}
                                        </span>
                                        
                                    ))}
                                </div>
                            </div>

                            <label className={styles.formLabel} htmlFor="gameFile">Game File (ZIP):</label>
                            <input
                                className={styles.formInput}
                                type="file"
                                id="gameFile"
                                name="gameFile"
                                accept=".zip"
                                ref={(input) => fileInputRefs?.current && (fileInputRefs.current["gameFile"] = input)}
                                onChange={(e) => handleFileChange(e, "gameFile")}
                            />
                        </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default PopupForm;
