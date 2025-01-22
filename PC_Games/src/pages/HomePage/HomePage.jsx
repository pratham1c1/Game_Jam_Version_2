import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import styles from './HomePage.module.css'; // Import the CSS module
import axios from "axios";

import GameCards from "../../components/GameTemplate/GameCards";
import SideNav from "../../components/BrowseSideNav/SideNav";
import CommonHeader from "../../components/PageHeader/CommonHeader";

function HomePage(props) {
    const [games, setGames] = useState([]);
    const location = useLocation();
    const loggedInUserName = props.loggedInUserName || "PC";
    const userName = location?.state?.userName || "PC";
    const [gameName, setGameName] = useState(null);
    const [gameNameRedirFlag, setGameNameRedirFlag] = useState(false);
    const [authorNameRedirFlag, setAuthorNameRedirFlag] = useState(false);
    const navigate = useNavigate();
    const [toggleSideNavbar, setToggleSideNavbar] =  useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [userLikedGameList,setUserLikedGameList] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        gameGenre: [],
        gamePlatform: [],
        maxPrice: null,
        beforeDate: null,
        searchQuery: "",
    });
    const [currentGameIndex, setCurrentGameIndex] = useState(0); // Track current game index

    

    const handleRedirect = () => {
        if (gameNameRedirFlag) {
            console.log("Redirecting to GamePage ...");
            navigate("/GamePage", {
                state: { gameName: `${gameNameRedirFlag}` , userName : `${userName}` , loggedInUserName:`${loggedInUserName}`}
            });
        }
        if(authorNameRedirFlag){
            console.log("Redirecting to Author Dashboard ...");
            navigate("/DashboardPage" ,{
                state:{userName:`${authorNameRedirFlag}`, loggedInUserName:`${loggedInUserName}`}
            });
        }
    };


    const fetchGames = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/games/getAllGames`);

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
            // alert("Failed to load games.");
        }
        try{
            const userLikedGames = await axios.get(`http://localhost:8080/api/userGames/getUserLikedGame/${loggedInUserName}`);
            setUserLikedGameList(userLikedGames.data);
        }
        catch(error){
            console.log("Error fetching Liked list : " , error);
        }
    };

    const handleAddGenre = (genre) => {
        if(genre){
        setFilterCriteria((prev) => ({
            ...prev,
            gameGenre: genre, // Add a new genre
        }));
        }else{
            setFilterCriteria((prev) => ({
                ...prev,
                gameGenre: [], // Add a empty genre
            }));
        }
    };
    const handleAddPlatform = (platforms) => {
        console.log("The platforms : " , platforms);
        if(platforms){
        setFilterCriteria((prev) => ({
            ...prev,
            gamePlatform: platforms, // Add a new platform
        }));
        }else{
            setFilterCriteria((prev) => ({
                ...prev,
                gamePlatform: [], // Add a empty platform
            }));
        }
    };

    const handleSearchQueryUpdate = (query) => {
        setFilterCriteria((prev) => ({
            ...prev,
            searchQuery: query // Add a new genre
        }));
        setSearchQuery(query);
    };
    
    const handleRemoveGenre = (genre) => {
        setFilterCriteria((prev) => ({
            ...prev,
            gameGenre: prev.gameGenre.filter((g) => g !== genre), // Remove a genre
        }));
    };
    
    const handleSetPrice = (price) => {
        setFilterCriteria((prev) => ({
            ...prev,
            maxPrice: price, // Set max price
        }));
    };
    const handleSetBeforeDate = (dateVal) => {
        console.log("The date received : " , dateVal);
        setFilterCriteria((prev) => ({
            ...prev,
            beforeDate: new Date(dateVal), // Set max date
        }));
    };

    const clearAllCriteria = () => {
        setFilterCriteria({
            gameGenre : [],
            gamePlatform: [],
            maxPrice: null,
            beforeDate: null,
            searchQuery: "",
        });
        console.log("Clearing filters in BrowseGames ...");
    }   

    const newReleaseGamesNextClick = () => {
        const scrollDiv = document.getElementById('newReleaseGames');
        scrollDiv.scrollLeft += 300;
    }

    const newReleaseGamesPrevClick = () => {
        const scrollDiv = document.getElementById('newReleaseGames');
        scrollDiv.scrollLeft -= 300;
    }

    const prevGame = () => {
        if(currentGameIndex != 0){
        setCurrentGameIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : games.length - 1));
        }
      };
    
      const nextGame = () => {
        setCurrentGameIndex((prevIndex) => (prevIndex < games.length - 1 ? prevIndex + 1 : 0));
      };
    
      const currentGame = games[currentGameIndex];


    useEffect(() => {
        console.log("Fetching games to browse...");
        fetchGames();
    }, []);

    useEffect(() => {
        handleRedirect();
    }, [gameNameRedirFlag,authorNameRedirFlag]);

    useEffect(()=>{
        console.log("Sidbar toggle : " , toggleSideNavbar);
        if(!toggleSideNavbar){
            document.getElementById("sideNavbar").style.height="30px";
            document.getElementById("sideNavbar").style.width="30px";
        }else{
            document.getElementById("sideNavbar").style.height="122%";
        }
    },[toggleSideNavbar]);



    return (
        <>
            <CommonHeader/>
            <div className={styles.MainDiv}>
                <div className={toggleSideNavbar?styles.sideNavbar.expanded:styles.sideNavbar} id="sideNavbar">
                    <SideNav
                        setToggleSideNavbar={setToggleSideNavbar}
                        handleAddGenre={handleAddGenre}
                        clearAllCriteria={clearAllCriteria}
                        handleAddPlatform={handleAddPlatform}
                        handleSetPrice={handleSetPrice}
                        handleSetBeforeDate={handleSetBeforeDate}
                    />
                </div>
                <div className={styles.mainGames}>
                    {/* <div className={styles.SearchSortFields}>
                        <div className={styles.SortFields}>
                            <h3>Sort by</h3>
                            <button onClick={() => handleSortChange("gameRating")}>Top Rated</button>
                            <button onClick={() => handleSortChange("gameIncome")}>Top Seller</button>
                            <button onClick={() => handleSortChange("gameDownloadCount")}>Most Popular</button>
                            <button onClick={() => handleSortChange("gameCreateDate")}>Most Recent</button>
                        </div>
                        <div className={styles.SearchField}>
                            <form action="/action_page.php">
                                <input onChange={(e)=>{handleSearchQueryUpdate(e.target.value)}} value={searchQuery} type="text" placeholder="Search.." name="search" />
                                    <i className={`fa fa-search ${styles.searchIcon}`}></i>
                            </form>
                        </div>
                    </div> */}
                    <div id="mainGameDiv" className={`${styles.Games} ${toggleSideNavbar ? styles.GamesExpanded : styles.GamesCollapsed}`}>
                        <div className={styles.featuredGamesDiv}>
                            <div id="featuredGamesInfo" className={styles.featuredGamesInfo}>
                                {/* Game Cover Image */}
                                <div className={styles.featuredGamesImageDiv}>
                                    <img
                                        src={`data:image/png;base64,${currentGame?.gameCoverImage?.data || ""}`}
                                        alt={currentGame?.gameName || "Game Cover"}
                                        className={styles.featuredGameImage}
                                    />
                                </div>

                                {/* Game Details */}
                                <div className={styles.featuredGamesDetails}>
                                    <h2 className={styles.featuredGameTitle}>{currentGame?.gameName || "Game Title"}</h2>
                                    <p className={styles.featuredGameDate}>
                                        Published Date: {new Date(currentGame?.publishedDate || Date.now()).toDateString()}
                                    </p>
                                    <div className={styles.featuredGameRating}>
                                        <span className={styles.featuredGameRatingStars}>
                                            {[...Array(5)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    className="fa fa-star"
                                                    style={{
                                                        color: i + 1 <= Math.floor(currentGame?.gameRating || 0) ? "gold" :
                                                            i < (currentGame?.gameRating || 0) ? "linear-gradient(to right, gold 50%, gray 50%)" :
                                                                "gray",
                                                    }}
                                                ></i>
                                            ))}
                                        </span>
                                        <span className={styles.featuredGameRatingValue}>
                                            ({(currentGame?.gameRating || 0).toFixed(1)})
                                        </span>
                                    </div>
                                    <p className={styles.featuredGameMetrics}>
                                        Downloads: {currentGame?.gameDownloadCount || 0} | Likes: {currentGame?.gameLikeCount || 0} | Platform : {currentGame?.gamePlatform || ""}
                                    </p>
                                    <p className={styles.featuredGameDescription}>
                                        {currentGame?.gameDescription || "No description available"}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className={styles.featuredGamesDivActionButton}>
                                <button className={styles.featuredGamesButton} onClick={prevGame}>❮</button>
                                <button className={styles.featuredGamesButton} onClick={nextGame}>❯</button>
                            </div>
                        </div>
                        <div className={styles.OtherGames}>
                            <div className={styles.gameTypeHeader}><h2>New Released</h2></div>
                            <div className={styles.newReleaseGamesDiv}>
                                <div id="newReleaseGames" className={styles.newReleaseGames}>
                                    {games.length > 0 ? (
                                        games.map((game) => (
                                            <GameCards
                                                key={game.gameId}
                                                gameImage={game.gameCoverImageUrl}
                                                gameNameValue={game.gameName}
                                                gameAuthorName={game.userName}
                                                gameGenre={game.gameGenre}
                                                gameDownloadCount={game.gameDownloadCount}
                                                gameRating={game.gameRating}
                                                gamePlatform={game.gamePlatform}
                                                gameLikeCount={game.gameLikeCount}

                                                savedGameFlag={userLikedGameList.includes(game.gameName)}
                                                savedGameFlagDisplay={loggedInUserName != game.userName}
                                                setGameNameRedirFlag={setGameNameRedirFlag}
                                                setAuthorNameRedirFlag={setAuthorNameRedirFlag}
                                                DashboardFlag={false}
                                                cancleFlag={false}
                                            />
                                        ))
                                    )
                                        : (
                                            <p style={{ color: "black" }}>No games available.</p>
                                        )
                                    }
                                </div>
                                <div className={styles.newReleaseGamesDivActionButton}>
                                    <button className={styles.featuredGamesButton} onClick={newReleaseGamesPrevClick}>❮</button>
                                    <button className={styles.featuredGamesButton} onClick={newReleaseGamesNextClick}>❯</button>
                                </div>
                            </div>
                            <div className={styles.gameTypeHeader}><h2>Trending</h2></div>
                            <div className={styles.gameTypeHeader}><h2>Popular Picks</h2></div>
                            <div className={styles.gameTypeHeader}><h2>Community Favorites</h2></div>
                            <div className={styles.gameTypeHeader}><h2>Game Jams Winners</h2></div>
                            <div className={styles.gameTypeHeader}><h2>Free to play</h2></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
