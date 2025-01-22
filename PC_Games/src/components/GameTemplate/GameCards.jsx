import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import styles from "./GameCards.module.css";
import { unstable_setDevServerHooks } from "react-router-dom";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

function GameCards(props) {
  const gameImage = props?.gameImage !== undefined ?props.gameImage:"/check_image.jpg"; // Default image
  const gameNameValue = props?.gameNameValue !== undefined ?props.gameNameValue:"New Game";
  const gameAuthorName = props?.gameAuthorName !== undefined ?props.gameAuthorName : "PC";
  const loggedInUser = props?.loggedInUser !== undefined ?props.loggedInUser : "PC";
  const gameGenre = props?.gameGenre !== undefined ?props.gameGenre:["Action", "Horror", "Adventure"];
  const gamePlatform = (props?.gamePlatform !== undefined && props?.gamePlatform.length !== 0) ?props.gamePlatform: ["Windows", "macOS", "Linux"];
  const gameLikeCount = props?.gameLikeCount !== undefined ?props.gameLikeCount:100;
  const gameRating = props?.gameRating !== undefined ?props.gameRating:4.5;
  const gameDownloadCount = props?.gameDownloadCount !== undefined ?props.gameDownloadCount: 450;
  const gameDescription = props?.gameDescription !== undefined ?props.gameDescription:"This is a description";
  const gameFirstSs = props?.gameFirstSs !== undefined ?props.gameFirstSs:null;
  const gameSecondSs = props?.gameSecondSs !== undefined ?props.gameSecondSs:null;
  const savedGameFlag = props.savedGameFlag !== undefined ?props.savedGameFlag:false;
  const savedGameFlagDisplay = props?.savedGameFlagDisplay !== undefined ?props.savedGameFlagDisplay:true;
  const setGameDeleteFlag = props.setGameDeleteFlag;
  const DashboardFlag = props?.DashboardFlag !== undefined ?props.DashboardFlag:false;  //To check if user is on Dashboard
  const [gameLikeFlag,setGameLikeFlag] = useState(props.savedGameFlag ?? true);
  const setGameNameRedirFlag = props.setGameNameRedirFlag;
  const setAuthorNameRedirFlag = props.setAuthorNameRedirFlag;
  const [visibleGameToOthers, setVisibleGameToOthers] = useState(props.visibleGameToOthers ?? false);
  const [clickedDiv, setClickedDiv] = useState(null);
  const percentage = (gameRating/5)*100;

  const [showPopup, setShowPopup] = useState(false);
  const popupTimeout = useRef(null);

  // Delete Game
  const deleteGame = async (gameName) => {
    if (DashboardFlag) {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${gameName}"?`
      );
      if (!confirmDelete) return;

      try {
        await axios.delete(
          `http://localhost:8080/api/games/deleteGameDetailsByName/${gameName}`
        );
        alert("Game Deleted Successfully!");
        setGameDeleteFlag((prev) => !prev);
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("Failed to delete game.");
      }
    }
  };

  // Like and Dislike functionality
  const handleLike = () => {
    console.log("Liked the game:", gameNameValue);
  };

  const handleDownload = () => {
    console.log("Downloading the game ...");
  }

  const handleClickAuthorName = (e) => {
    console.log("Clicked on Author name ... : ", e.target.textContent);
    setAuthorNameRedirFlag(e.target.textContent);
  }

  const handleClickGameName = async(e) => {
    console.log("Clicked on Game name ... : ");
    const gameNameClickResult = await axios.put(`http://localhost:8080/api/games/updateGameViewCount/${gameNameValue}`);
    console.log(gameNameClickResult);
    setGameNameRedirFlag(e.target.textContent);
  }

  // Redirect Logic
  const handleImageClick = (e) => {
    console.log("Redirecting to game details page:", gameNameValue);
    setGameNameRedirFlag(gameNameValue);
    // Add redirect logic here
  };

  // Handle Mouse Hover for Popup
  const handleMouseEnter = () => {
    popupTimeout.current = setTimeout(() => {
      console.log("Opening popup ...");
      setShowPopup(false);
    }, 3000); // Delay of 1 second
  };

  const handleMouseLeave = () => {
    // console.log("Clearing the popup...");
    clearTimeout(popupTimeout.current);
    setShowPopup(false);
  };

  const renderPlatformIcons = () =>
    gamePlatform.map((platform, index) => (
      <span key={index} className={styles.icon}>
        {platform === "Windows" && <i className="fa fa-windows"></i>}
        {platform === "macOS" && <i className="fa fa-apple"></i>}
        {platform === "Linux" && <i className="fa fa-linux"></i>}
        {platform === "Android" && <i className="fa fa-android"></i>}
      </span>
    ));

    const changePublishStatusAPI = async (gameName , publishStatus) => {
      try{
          const gameData = await axios.put(`http://localhost:8080/api/games/updatePublishStatue/${gameName}/${publishStatus}`);
          console.log("Game publish status updated succesfully.");
      }catch(e){
        console.log("Error changing publish status : " , e);
      }
    }

    const handleDivClick = (divType) => {
      if(DashboardFlag){
      if(divType === "dev" && clickedDiv != "dev"){
        changePublishStatusAPI(gameNameValue,divType === "publish");
        document.getElementById(`publishSemiCircleId-${gameNameValue}`).style.width = "20px";
        document.getElementById(`devSemiCircleId-${gameNameValue}`).style.width = "38px";
        setClickedDiv(divType);
        setVisibleGameToOthers(divType === "publish");
      }
      else if(divType === "publish" && clickedDiv != "publish"){
        changePublishStatusAPI(gameNameValue,divType === "publish");
        document.getElementById(`publishSemiCircleId-${gameNameValue}`).style.width = "38px";
        document.getElementById(`devSemiCircleId-${gameNameValue}`).style.width = "20px";
        setClickedDiv(divType);
        setVisibleGameToOthers(divType === "publish");
      }
    }
    };
  
    const getOpacity = (type) => {
      if (clickedDiv) {
        return type === clickedDiv ? 1 : 0.3;
      }
      return visibleGameToOthers === (type === "publish") ? 1 : 0.3;
    };
    const handleMouseEnterCombined = () => {
      handleMouseEnter();
      handleSemiCircleEnterEffect();
  };
  
  const handleMouseLeaveCombined = () => {
      handleMouseLeave();
      handleSemiCircleLeaveEffect();
  };

  const handleSemiCircleLeaveEffect = () => {
    if(DashboardFlag){
    document.getElementById(`publishSemiCircleId-${gameNameValue}`).style.width = "0px";
    document.getElementById(`devSemiCircleId-${gameNameValue}`).style.width = "0px";
    }
  }

  const handleSemiCircleEnterEffect = () => {
    console.log("The dashboard flag : " , DashboardFlag);
    if(DashboardFlag){
    if(visibleGameToOthers){
        document.getElementById(`publishSemiCircleId-${gameNameValue}`).style.width = "38px";
        document.getElementById(`devSemiCircleId-${gameNameValue}`).style.width = "20px";
    }
    else{
        document.getElementById(`publishSemiCircleId-${gameNameValue}`).style.width = "20px";
        document.getElementById(`devSemiCircleId-${gameNameValue}`).style.width = "38px";
    }
  }
  }

  const handleLikeGame = async(gameNameValue) => {
    console.log(`${gameNameValue} added successfully in Likedgame List.`);
    console.log("gameLikeFlag : " , gameLikeFlag);
    if(gameLikeFlag){
      document.getElementById(`LikeGameIcon-${gameNameValue}`).style.color = "#777777";
      setGameLikeFlag(false);
      const LikeGameMessage = await axios.put(`http://localhost:8080/api/userGames/removeGameFromUserLikedGames/${loggedInUser}/${gameNameValue}`);
      console.log(LikeGameMessage);
    }
    else{
      document.getElementById(`LikeGameIcon-${gameNameValue}`).style.color = "#048348";
      setGameLikeFlag(true);
      const LikeGameMessage = await axios.put(`http://localhost:8080/api/userGames/addGameToUserLikedGames/${loggedInUser}/${gameNameValue}`);
      console.log(LikeGameMessage);
    }
  }

  useEffect(()=>{
    setGameLikeFlag(props.savedGameFlag);
  },[props.savedGameFlag]);

  
  return (
    <>
      <div
        className={styles.card}
        onMouseEnter={handleMouseEnterCombined}
        onMouseLeave={handleMouseLeaveCombined}
      >
        {/* Card Image */}
        <div className={styles.card_Image}>
          <BookmarkAddIcon
          style={{
            color: savedGameFlag? "#048348" : "#777777",
            display: savedGameFlagDisplay?"flex":"none"
          }}
          className={styles.gameLikedIcon}
          onClick={() => handleLikeGame(gameNameValue)}
          id={`LikeGameIcon-${gameNameValue}`}
          title="Add to favorite"
          sx={{fontSize:25 , width:20}}
          viewBox="9 0 7 24"
          />
          <i
            style={{ display: DashboardFlag ? "flex" : "none"}}
            className={`fa fa-trash ${styles.clearIcon}`}
            onClick={() => deleteGame(gameNameValue)}
            title="Clear all filters"
          ></i>
          <img onClick={(e) => {handleImageClick(e)}} src={gameImage} alt={gameNameValue} />
          {/* {gameImage} */}
        </div>

        {/* Card Content */}
        <div className={styles.card_value}>
        
          {/* Likes, Dislikes, and Downloads */}
          <div className={styles.gameNumbers}>
            <div className={styles.gameLikeDislike}><i className="fa fa-thumbs-up" onClick={handleLike}></i> {gameLikeCount}
            </div>
            <div className={styles.gameDownloadsView}><i className="fa fa-download" onClick={handleDownload}></i> {gameDownloadCount}</div>
          </div>

          {/* Game Name */}
          <div className={styles.gameNameInfo}>
            <div className={styles.gameStatusCircle}>
            <div
              id={`devSemiCircleId-${gameNameValue}`}
              className={`${styles.devSemiCircleOnCard} ${clickedDiv === "dev" ? "clicked" : ""}`}
              style={{
                opacity: getOpacity("dev"),
                left: "0px",
                width:"0px",
                display:DashboardFlag?"flex":"none"
              }}
              onClick={() => handleDivClick("dev")}
            >
              D
            </div>
            <div
              id={`publishSemiCircleId-${gameNameValue}`}
              className={`${styles.publishSemiCircleOnCard} ${clickedDiv === "publish" ? "clicked" : ""
                }`}
              style={{
                opacity: getOpacity("publish"),
                left: "0px",
                width:"0px",
                display:DashboardFlag?"flex":"none"
              }}
              onClick={() => handleDivClick("publish")}
            >
              P
            </div>
            </div>
            <div className={styles.gameNameValues}>
              <h4 onClick={(e) => { handleClickGameName(e) }}>{gameNameValue}</h4>
              <h5 onClick={(e) => { handleClickAuthorName(e) }}>{gameAuthorName}</h5>
            </div>
            <div className={styles.gameRatingIcon}
              style={{
                background: `linear-gradient(90deg, #ffdc0c ${percentage}%, #858585 ${percentage}%)`,
                WebkitBackgroundClip: "text", // For applying background to text
                WebkitTextFillColor: "transparent", // Ensures only text gets the gradient
              }}
            >
              <i className="fa fa-star"></i>
              <h6 style={{WebkitTextFillColor: "black"}}>{gameRating}</h6>
            </div>
          </div>
          {/* Platforms and Genre */}
          {gamePlatform.length > 0 && (
            <div className={styles.gameStrip}>{renderPlatformIcons()}</div>
          )}
          {gameGenre.length > 0 && (
            <div className={styles.gameStrip}>
              {gameGenre.map((genre, index) => (
                <span key={index} className={styles.genreTag}>
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Popup for Details */}
      {showPopup && gameDescription && (
        <div className={styles.popup}>
          <h4>{gameNameValue}</h4>
          <p>{gameDescription}</p>
          {gameFirstSs && (
            <img src={gameFirstSs} alt="First Screenshot" className={styles.popupImage} />
          )}
          {gameSecondSs && (
            <img src={gameSecondSs} alt="Second Screenshot" className={styles.popupImage} />
          )}
        </div>
      )}
    </>
  );
}

export default GameCards;