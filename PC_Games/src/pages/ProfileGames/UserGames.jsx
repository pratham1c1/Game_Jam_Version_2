import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import GameCards from '../../components/GameTemplate/GameCards';
import styles from './UserGames.module.css'; // Import the CSS module
import axios from "axios";
import PopupForm from '../../components/PopupForm/PopupForm';
import CommonHeader from "../../components/PageHeader/CommonHeader";
import AddCardIcon from '@mui/icons-material/AddCard';
import Tooltip from '@mui/material/Tooltip';

function UserGames() {
    const baseGame = {
        gameImage: "no_image.png",
        gameNameValue: "Common",
        gameAuthorName: "PC",
        // Note: We DO NOT include the setter functions here.
        // They are props of the parent, not data in the 'games' array.
    };
    
    // 2. Create the dummy array (e.g., 10 items)
    const DUMMY_ARRAY_SIZE = 10;
    
    const dummyGamesData = Array.from({ length: DUMMY_ARRAY_SIZE }, (_, index) => ({
        // Use the spread operator to include all base properties
        ...baseGame,
        // Add a unique identifier, which will be used for the React 'key'
        gameId: index,
        gameRating : (Math.floor(Math.random() * 41) + 10)/10,
        gameLikeCount : Math.floor(Math.random() * (200 - 50 + 1)) + 50,
        gameDownloadCount : Math.floor(Math.random() * (400 - 200 + 1)) + 200,
        // OPTIONAL: Make the name dynamic for better differentiation
        gameNameValue: `Common Game ${index + 1}`, 
    }));


    const [games, setGames] = useState([]);
    const location = useLocation();
    const loggedInUserName = location?.state?.loggedInUserName || "PC";
    const userName = location?.state?.userName || "PC";
    const [isPopupVisible, setPopupVisible] = useState(0);
    const [gameName, setGameName] = useState(null);
    const popupRef = useRef(null);
    const fileInputRefs = useRef({});
    const [headerRedirFlag, setHeaderRedirFlag] = useState(false);
    const [gameNameRedirFlag, setGameNameRedirFlag] = useState(false);
    const [authorNameRedirFlag, setAuthorNameRedirFlag] = useState(false);
    const [userLikedGameList, setUserLikedGameList] = useState([]);
    const [formData, setFormData] = useState({
        gameName: "",
        gameDescription: "",
        gameInstallInstruc: "",
        gameVideoLink: "",
        gameGenre: "",
        gameCoverImage: null,
        gameFirstSs: null,
        gameSecondSs: null,
        gameBackgroundImage: null,
        gameFile: null
    });
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (gameNameRedirFlag) {
            console.log("Redirecting to GamePage ...");
            navigate("/GamePage", {
                state: { gameName: `${gameNameRedirFlag}` , userName : `${userName}`}
            });
        }
        if(authorNameRedirFlag){
            console.log("Redirecting to Author Dashboard ...");

        }
    };

    const resetFormData = () => {
        Object.values(fileInputRefs.current).forEach((input) => {
            if (input) {
                input.value = ""; // Reset the file input to empty
            }
        });

        setFormData({
            gameName: "",
            gameDescription: "",
            gameInstallInstruc: "",
            gameVideoLink: "",
            gameCoverImage: null,
            gameFirstSs: null,
            gameSecondSs: null,
            gameBackgroundImage: null,
            gameFile: null
        });
    };

    const [gameDeleteFlag, setGameDeleteFlag] = useState(false);

    const displayForm = () => {
        if (loggedInUserName == userName) {
            if (isPopupVisible) {
                resetFormData(); // Clear the form when it's being closed
            }
            isPopupVisible === 0 ? setPopupVisible(1) : setPopupVisible(0);
        }
    };

    const fetchGames = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/userGames/getAllGames/${userName}`);

            if (!response.data) {
                console.error("No games data found.");
                setGames([]); // Set an empty array if no data is returned
                return;
            }

            console.log("The response : ", response);

            // Map and process the data
            const gamesWithImageURL = response.data.map((game) => ({
                ...game,
                gameCoverImageUrl: game.gameCoverImage && game.gameCoverImage.data
                    ? `data:image/png;base64,${game.gameCoverImage.data}` // Use the base64 image if available
                    : `/no_image.png` // Fallback to the public 'no_image.png'
            }));

            setGames(gamesWithImageURL); // Set processed data to state
        } catch (error) {
            console.error("Error fetching games:", error);
            alert("Failed to load games.");
            setGames(dummyGamesData);
        }
        try{
            const userLikedGames = await axios.get(`http://localhost:8080/api/userGames/getUserLikedGame/${loggedInUserName}`);
            // console.log("The userLiked games : " , userLikedGames.data.includes("Night Demon"));
            setUserLikedGameList(userLikedGames.data);
        }
        catch(error){
            console.log("Error fetching Liked list : " , error);
        }
    };

    useEffect(() => {
        console.log("Fetching games ...with isPopupVisible : ", isPopupVisible);
        // fetchGames();
        if (isPopupVisible !== 0) {
            document.getElementById("mainPageId").style.webkitFilter = "blur(4px)";
            document.body.style.overflowY = 'hidden';
            document.getElementById("pagePopuId").style.animation = "popupAnimationOpen 0.5s linear";
            document.getElementById("pagePopuId").style.animationFillMode = 'forwards';

            const handleClickOutside = (event) => {
                console.log("popup current : ", popupRef.current, " & contains : ", event.target);
                if (popupRef.current && !popupRef.current.contains(event.target)) {
                    document.getElementById("pagePopuId").style.animation = "popupAnimationClose 0.5s linear";
                    document.getElementById("mainPageId").style.webkitFilter = "blur(0px)";
                    document.body.style.overflowY = 'scroll';
                    resetFormData();
                    setPopupVisible(0);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        } else {
            document.getElementById("mainPageId").style.webkitFilter = "";
            document.body.style.overflowY = 'auto';
        }
    }, [isPopupVisible]);

    useEffect(()=>{
        console.log("Fetching games for Dashboard ...");
        fetchGames();
    },[userName,gameDeleteFlag]);

    useEffect(() => {
        handleRedirect();
    }, [gameNameRedirFlag,authorNameRedirFlag]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0]; // Get the uploaded file
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: file, // Add the file to the form data
        }));
    };

    const handleGameGenre = (selectedGameGenre) => {
        setFormData((prevData) => ({
            ...prevData,
            gameGenre : selectedGameGenre
        }));
        console.log("It is in handleGameGenre ... with value : " , selectedGameGenre);
    };

    const handleSubmit = async (e,selectedGameGenre,selectedGamePlateForms) => {
        e.preventDefault();
        const data = new FormData();

        data.append("gameName", formData.gameName);
        data.append("userName", userName); // Add the username to the request
        data.append("gameVideoLink", formData.gameVideoLink);
        data.append("gameDescription", formData.gameDescription);
        data.append("gameInstallInstruc", formData.gameInstallInstruc);
        data.append("gameGenre" , selectedGameGenre);
        data.append("gamePlatform" , selectedGamePlateForms);
        if (formData.gameCoverImage) data.append("gameCoverImage", formData.gameCoverImage);
        if (formData.gameFirstSs) data.append("gameFirstSs", formData.gameFirstSs);
        if (formData.gameSecondSs) data.append("gameSecondSs", formData.gameSecondSs);
        if (formData.gameFile) data.append("gameFile", formData.gameFile);

        try {
            const response = await axios.post("http://localhost:8080/api/games/addGame", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            isPopupVisible === 0 ? setPopupVisible(1) : setPopupVisible(0);
            console.log("Game added successfully:", response.data);
            alert("Game added successfully!");
            fetchGames();
            resetFormData(); // Reset the game-form fields
        } catch (e) {
            console.error("Error Uploading data !", e);
            alert("Upload Failed..");
        }
    };

    return (
        <>
            <CommonHeader/> 
            <div className={styles.MainDiv}>
                <div className={styles.UserFields}>
                    <div className={styles.Username}>
                        <h3>{userName}</h3>
                    </div>
                    <div className={styles.ActionButtons}>
                        <button className={styles.gameAddIconButton} style={{display:(loggedInUserName == userName)?"flex":"none"}}>
                        <Tooltip title="Add New Game">
                            <AddCardIcon 
                                title="Add New Game"
                                onClick={displayForm}
                                sx={{fontSize:40}}
                            />
                        </Tooltip>
                        </button>
                    </div>
                </div>
                <div id="mainPageId" className={styles.Games}>
                    {games.length > 0 ? (
                        games.map((game) => (
                            <GameCards
                                    key={game.gameId}
                                    gameImage={game.gameCoverImageUrl}
                                    gameNameValue={game.gameNameValue}
                                    gameAuthorName={userName}
                                    gameGenre = {game.gameGenre}
                                    gameDownloadCount = {game.gameDownloadCount}
                                    gameRating = {game.gameRating}

                                    gamePlatform = {game.gamePlatform}
                                    gameLikeCount = {game.gameLikeCount}

                                    savedGameFlag = {userLikedGameList.includes(game.gameName)}
                                    savedGameFlagDisplay = {loggedInUserName != game.userName}
                                    setGameNameRedirFlag={setGameNameRedirFlag}
                                    setAuthorNameRedirFlag={setAuthorNameRedirFlag}
                                    DashboardFlag={(loggedInUserName == userName)?true:false}
                                    setGameDeleteFlag={setGameDeleteFlag}
                                    visibleGameToOthers={game.publishStatus}
                            />
                        ))
                    ) : (
                        <p>No games available.</p>
                    )}
                </div>
                <div className={styles.UserForm} style={{ display: isPopupVisible ? 'block' : 'none' }}>
                    <div id="pagePopuId" ref={popupRef} className={styles.pagePopupForm}>
                        <PopupForm isPopupVisible={isPopupVisible} setpopupDiv={setPopupVisible} formData={formData} setFormData={setFormData} resetFormData={resetFormData} handleChange={handleChange} handleSubmit={handleSubmit} handleFileChange={handleFileChange} fileInputRefs={fileInputRefs} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserGames;
