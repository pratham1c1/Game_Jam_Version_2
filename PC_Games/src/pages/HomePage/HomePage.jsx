import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate, useLocation, useBlocker } from "react-router-dom";
import styles from './HomePage.module.css'; // Import the CSS module
import axios from "axios";

import GameCards from "../../components/GameTemplate/GameCards";
import SideNav from "../../components/BrowseSideNav/SideNav";
import CommonHeader from "../../components/PageHeader/CommonHeader";

function HomePage(props) {
    const baseGame = {
        gameImage: "no_image.png",
        gameCoverImage : "no_image.png",
        gameName: "Common",
        gameAuthorName: "PC",
        gameDescription : "Embark on an epic quest in Emberfall, a vast open-world RPG where every choice shapes your destiny. Master a unique, real-time combat system as you explore ancient ruins and face mythical beasts. Forge alliances and uncover the secrets of a broken realm before a creeping shadow consumes all.",

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
        gameName: `Common Game ${index + 1}`, 
    }));

    const [games, setGames] = useState(dummyGamesData);
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
    const [searchFlag, setSearchFlag] = useState(false);
    const [currentGameIndex, setCurrentGameIndex] = useState(0); // Track current game index
    const ANIMATION_DURATION = 500;
    const [animationDirection, setAnimationDirection] = useState(0);    
    const [lastDirection, setLastDirection] = useState(0);

    const handleRedirect = () => {
        if (gameNameRedirFlag) {
            console.log("Redirecting to GamePage ...");
            navigate("/GameDetailsPage", {
                state: { gameName: `${gameNameRedirFlag}` , userName : `${userName}` , loggedInUserName:`${loggedInUserName}`}
            });
        }
        if(authorNameRedirFlag){
            console.log("Redirecting to Author Dashboard ...");
            navigate("/UserGames" ,{
                state:{userName:`${authorNameRedirFlag}`, loggedInUserName:`${loggedInUserName}`}
            });
        }
    };


    const fetchGames = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/games/getAllGames`);

            if (!response.data) {
                console.error("No games data found.");
                setGames(dummyGamesData); // Set an empty array if no data is returned
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
            console.error("Error fetching games:", dummyGamesData);
            setGames(dummyGamesData);
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

    const sortGames = (games, option) => {
        const {field, order} = option;
        return [...games].sort((a,b) => {
            const valA = a[field];
            const valB = b[field];
            if (valA > valB) return order === "asc" ? 1 : -1;
            if (valA < valB) return order === "asc" ? -1 : 1;
            return 0;
        });
    };
    const handleSortChange = (field) => {
        setSortOption((prevOptions) => ({
            field,
            order: prevOptions.field === field && prevOptions.order === "asc" ? "desc" : "asc",
        }));
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
    
    const handleSearchClick = () => {
        setSearchFlag((prev) => !prev);
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
    };

    const newReleaseGamesNextClick = (id) => {
        if(id){
        const scrollDiv = document.getElementById(id);
        scrollDiv.scrollLeft += 300;
        }
    };

    const newReleaseGamesPrevClick = (id) => {
        if(id){
        const scrollDiv = document.getElementById(id);
        scrollDiv.scrollLeft -= 300;
        }
    };

    const handleTransition = (newIndex, direction) => {
        setAnimationDirection(direction); // Set direction (1 or 2)
        setLastDirection(direction); // <--- NEW: Remember the direction

        setTimeout(() => {
            setCurrentGameIndex(newIndex);
            setAnimationDirection(0); // Reset after delay
        }, ANIMATION_DURATION);
    };

    const prevGame = () => {
        if(currentGameIndex != 0){
        //  setCurrentGameIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : games.length - 1));

        if (animationDirection !== 0) return; // Prevent double clicks

        const newIndex = (currentGameIndex > 0) ? currentGameIndex - 1 : games.length - 1;
        handleTransition(newIndex, 2); // 2 for Previous (slide right)

        }
      };
    
      const nextGame = () => {
        // setCurrentGameIndex((prevIndex) => (prevIndex < games.length - 1 ? prevIndex + 1 : 0));
        if (animationDirection !== 0) return; // Prevent double clicks
        
        const newIndex = (currentGameIndex < games.length - 1) ? currentGameIndex + 1 : 0;
        handleTransition(newIndex, 1); // 1 for Next (slide left)

      };

      const getAnimationClass = () => {
        if (animationDirection === 1) {
            return styles['slide-out-left'];
        }
        if (animationDirection === 2) {
            return styles['slide-out-right'];
        }
        // When animationDirection is 0, we apply the slide-in effect 
        // that matches the direction the content *just* came from.
        // This makes the transition look like a continuous slide.
        if (lastDirection === 1) { // If we came from the NEXT button (slid out left)
        return styles['slide-in-right']; // New content slides IN from the RIGHT
        }
        if (lastDirection === 2) { // If we came from the PREVIOUS button (slid out right)
            return styles['slide-in-left']; // New content slides IN from the LEFT
        }
    
        return styles['slideEffectDefault'];;
    };


      const filterGame = (games, options) => {
        const {field , value} = options;
        return games.filter((game) => {
            if(game.gamePrice !== value)
                return false;
            return true;
        });
      };
    
      const currentGame = games[currentGameIndex];
      const newReleasedGamesList = sortGames(games,{ field: "gameDownloadCount", order: "asc" });
      const trendingGamesList = sortGames(games, {field : "gameRating" , order: "desc"});
      const popularGamesList = sortGames(games, {field : "gameDownloadCount" , order: "desc"});
      const freeGamesList = filterGame(games, {field : "gamePrice" }); // , value: 0});
      


    useEffect(() => {
        console.log("Fetching games to browse...");
        fetchGames();
        console.log("New released games : " , newReleasedGamesList);
    }, []);

    useEffect(() => {
        handleRedirect();
    }, [gameNameRedirFlag,authorNameRedirFlag]);

    // SideNav useEffect
    // useEffect(()=>{
    //     console.log("Sidbar toggle : " , toggleSideNavbar);
    //     if(!toggleSideNavbar){
    //         document.getElementById("sideNavbar").style.height="30px";
    //         document.getElementById("sideNavbar").style.width="30px";
    //     }else{
    //         document.getElementById("sideNavbar").style.height="122%";
    //     }
    // },[toggleSideNavbar]);



    return (
        <>
            <CommonHeader/>
            <div className={styles.MainDiv}>
                {/* <div className={toggleSideNavbar?styles.sideNavbar.expanded:styles.sideNavbar} style={{backgroundColor : "#f5f5f5"}} id="sideNavbar"> */}
                    {/* <SideNav
                        setToggleSideNavbar={setToggleSideNavbar}
                        handleAddGenre={handleAddGenre}
                        clearAllCriteria={clearAllCriteria}
                        handleAddPlatform={handleAddPlatform}
                        handleSetPrice={handleSetPrice}
                        handleSetBeforeDate={handleSetBeforeDate}
                    /> */}
                {/* </div> */}
                <div className={styles.mainGames}>
                    <div id="mainGameDiv" className={`${styles.Games} ${toggleSideNavbar ? styles.GamesExpanded : styles.GamesCollapsed}`}>
                        <div id="searchDiv" className={searchFlag?styles.searchGamesDivAfter:styles.searchGamesDivBefore}>
                            <form id="searchFormId" action="/action_page.php" className={styles.SearchFormDiv}>
                                <input className={styles.searchGamesDivInput} onChange={(e) => { handleSearchQueryUpdate(e.target.value) }} value={searchQuery} type="text" placeholder="Search.." name="search" />
                            </form>
                            <i onClick={handleSearchClick} className={`fa fa-search ${searchFlag ? styles.searchIconBefore : styles.searchIconAfter}`}></i>
                        </div>
                        <div className={styles.featuredGamesDiv}>
                            <div id="featuredGamesInfo" className={styles.featuredGamesInfo}>
                                <div key={currentGame.id} // Ensures React remounts the element when the ID changes
                                        className={getAnimationClass()}>
                                    {/* Game Cover Image */}
                                    <div className={styles.featuredGamesImageDiv}>
                                        <img
                                            src={
                                                currentGame?.gameCoverImage?.data
                                                ? `data:image/png;base64,${currentGame.gameCoverImage.data}`
                                                : "/check_image.jpg"
                                            }
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
                                        {newReleasedGamesList.length > 0 ? (
                                            newReleasedGamesList.map((game) => (
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
                                        <button className={styles.featuredGamesButton} onClick={() => newReleaseGamesPrevClick("newReleaseGames")}>❮</button>
                                        <button className={styles.featuredGamesButton} onClick={() => newReleaseGamesNextClick("newReleaseGames")}>❯</button>
                                    </div>
                                </div>
                            <div className={styles.gameTypeHeader}><h2>Trending</h2></div>
                                <div className={styles.newReleaseGamesDiv}>
                                    <div id="trendingGames" className={styles.newReleaseGames}>
                                            {trendingGamesList.length > 0 ? (
                                                trendingGamesList.map((game) => (
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
                                        <button className={styles.featuredGamesButton} onClick={() => newReleaseGamesPrevClick("trendingGames")}>❮</button>
                                        <button className={styles.featuredGamesButton} onClick={() => newReleaseGamesNextClick("trendingGames")}>❯</button>
                                    </div>
                                </div>
                            <div className={styles.gameTypeHeader}><h2>Popular Picks</h2></div>
                                <div className={styles.newReleaseGamesDiv}>
                                    <div id="popularGames" className={styles.newReleaseGames}>
                                                {popularGamesList.length > 0 ? (
                                                    popularGamesList.map((game) => (
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
                                        <button className={styles.featuredGamesButton} onClick={() => newReleaseGamesPrevClick("popularGames")} >❮</button>
                                        <button className={styles.featuredGamesButton} onClick={() => newReleaseGamesPrevClick("popularGames")} >❯</button>
                                    </div>
                                </div>
                            {/* <div className={styles.gameTypeHeader}><h2>Community Favorites</h2></div>
                            <div className={styles.gameTypeHeader}><h2>Game Jams Winners</h2></div> */}
                            <div className={styles.gameTypeHeader}><h2>Free to play</h2></div>
                                <div className={styles.newReleaseGamesDiv}>
                                    <div id="freeGames" className={styles.newReleaseGames}>
                                                {freeGamesList.length > 0 ? (
                                                    freeGamesList.map((game) => (
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
                                        <button className={styles.featuredGamesButton} onClick={() => newReleaseGamesPrevClick("freeGames")} >❮</button>
                                        <button className={styles.featuredGamesButton} onClick={() => newReleaseGamesPrevClick("freeGames")} >❯</button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
