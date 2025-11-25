import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import styles from './BrowseGames.module.css'; // Import the CSS module
import axios from "axios";

import GameCards from "../../components/GameTemplate/GameCards";
import SideNav from "../../components/BrowseSideNav/SideNav";
import CommonHeader from "../../components/PageHeader/CommonHeader";

function BrowseGames(props) {
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
    const loggedInUserName = props.loggedInUserName || "PC";
    const userName = location?.state?.userName || "PC";
    const [gameName, setGameName] = useState(null);
    const [gameNameRedirFlag, setGameNameRedirFlag] = useState(false);
    const [authorNameRedirFlag, setAuthorNameRedirFlag] = useState(false);
    const navigate = useNavigate();
    const [toggleSideNavbar, setToggleSideNavbar] =  useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOptions, setSortOptions] = useState({ field: "gameName", order: "desc" }); //Default sort
    const [userLikedGameList,setUserLikedGameList] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        gameGenre: [],
        gamePlatform: [],
        maxPrice: null,
        beforeDate: null,
        searchQuery: "",
    });
    
    

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

    const sortGames = (games, options) => {
        const { field, order } = options;
        return [...games].sort((a, b) => {
            const valA = a[field];
            const valB = b[field];
            if (valA < valB) return order === "asc" ? 1 : -1;
            if (valA > valB) return order === "asc" ? -1 : 1;
            return 0;
        });
    };

    const handleSortChange = (field) => {
        setSortOptions((prevOptions) => ({
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

    const filteredGames = (games, criteria) => {
        console.log("Criteria : " , criteria);
        return games.filter((game) => {
            // Filter by gameGenre if criteria provided
            // if (criteria.gameGenre.length > 0 && !criteria.gameGenre.some((genre) => game.gameGenre.includes(genre))) {
            //     return false;
            // }
            // Filter by gamePlatform if criteria provided
            if (criteria.gamePlatform.length > 0 && !criteria.gamePlatform.some((platform) => game.gamePlatform.includes(platform))) {
                return false;
            }
            // Filter by maxPrice
            // console.log("The gamePrice : " , game.gamePrice , " & maxPrice : " , criteria.maxPrice);
            // if (criteria.maxPrice && game.gamePrice > criteria.maxPrice) {
            //     return false;
            // }
            // Filter by beforeDate
            // if (criteria.beforeDate && !(criteria.beforeDate && new Date((game.gameCreateDate).toString()) >= criteria.beforeDate)) {
            //     return false;
            // }
            // Filter by searchQuery
            if (criteria.searchQuery && !(
                game.gameNameValue.toLowerCase().includes(criteria.searchQuery.toLowerCase()) ||
                game.gameAuthorName.toLowerCase().includes(criteria.searchQuery.toLowerCase()) //||
                //game.gamePlatform.some((platform) => platform.toLowerCase().includes(criteria.searchQuery.toLowerCase())) //||
                // game.gameGenre.some((genre) => genre.toLowerCase().includes(criteria.searchQuery.toLowerCase()))
            )) {
                return false;
            }
    
            return true;
        });
    };
    

    const sortedGames = sortGames(games, sortOptions);
    const filterGames = filteredGames(sortedGames,filterCriteria);    


    useEffect(() => {
        console.log("Fetching games to browse...");
        fetchGames();
    }, []);

    useEffect(() => {
        handleRedirect();
    }, [gameNameRedirFlag,authorNameRedirFlag]);

    useEffect(()=>{
        console.log("Sidbar toggle : " , toggleSideNavbar);
    },[toggleSideNavbar]);



    return (
        <>
            <CommonHeader/>
            <div className={styles.MainDiv}>
                <div className={styles.sideNavbar}>
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
                    <div className={styles.SearchSortFields}>
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
                                    {/* <button type="submit"><i className="fa fa-search"></i></button> */}
                                    <i className={`fa fa-search ${styles.searchIcon}`}></i>
                            </form>
                            {/* <button onClick={displayForm}>Add</button> */}
                        </div>
                    </div>
                    <div id="mainPageId" className={toggleSideNavbar?styles.Games:styles.GamesCollapsed}>
                        {filterGames.length > 0 ? (
                            filterGames.map((game) => (
                                <GameCards
                                    key={game.gameId}
                                    gameId = {game.gameId}
                                    gameImage={game.gameCoverImageUrl}
                                    gameNameValue={game.gameNameValue}
                                    gameAuthorName={game.gameAuthorName} //game.userName
                                    gameGenre = {game.gameGenre}
                                    gameDownloadCount = {game.gameDownloadCount}
                                    // gameRating = {Math.round((game.gameRatingCount/game.gameRaters) * 1e1) / 1e1}
                                    gameRating = {game.gameRating}
                                    gamePlatform = {game.gamePlatform}
                                    gameLikeCount = {game.gameLikeCount}

                                    savedGameFlag = {userLikedGameList.includes(game.gameName)}
                                    savedGameFlagDisplay = {loggedInUserName != game.userName}
                                    setGameNameRedirFlag={setGameNameRedirFlag}
                                    setAuthorNameRedirFlag={setAuthorNameRedirFlag}
                                    initialIsLiked={false}
                                    DashboardFlag={false}
                                    cancleFlag={false}
                                />
                            ))
                        ) : (
                            <p style={{color:"black"}}>No games available.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BrowseGames;
