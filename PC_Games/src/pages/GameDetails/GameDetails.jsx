import axios from "axios";
import { useEffect, useState , useRef} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './GameDetails.module.css'; // Import the CSS module
import CommonHeader from "../../components/PageHeader/CommonHeader";
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentTemplate from "../../components/CommentTemplate/commentTemplate";

function GameDetails(props) {
    const [gameInfo, setGameInfo] = useState(null);
    const [gameCoverImage, setGameCoverImage] = useState(null);
    const [gameFirstSs, setGameFirstSs] = useState(null);
    const [gameSecondSs, setGameSecondSs] = useState(null);
    const [gameFile, setGameFile] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const location = useLocation();
    const gameName = location?.state.gameName || {}; // props.gameName
    const [gameDescription , setGameDescription] = useState("Loading ...");
    const [gameInstallInstruction , setGameInstallInstruction] = useState("Loading ...");
    // const gameName = "2nd Game";
    const loggedInUserName = location?.state?.loggedInUserName || "PC";
    const [userName, setUserName] = useState(null);
    const [comments, setComments] = useState([
        { id: 1735915550064, text: 'first comment' }]);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [newCommentIndex, setNewCommentIndex] = useState(null);
    const [gameModify, setGameModify] = useState(true);
    const fileInputRefs = useRef({});
    // Update Info flags
    const [fileUpdateFlag , setFileUpdateFlag] = useState(false);
    const [gameCoverImageUpdateFlag , setGameCoverImageUpdateFlag] = useState(false);
    const [gameFirstSsUpdateFlag , setGameFirstSsUpdateFlag] = useState(false);
    const [gameSecondSsUpdateFlag , setGameSecondSsUpdateFlag] = useState(false);
    const [gameDescUpdateFlag , setGameDescUpdateFlag] = useState(false);
    const [gameInstallInstrUpdateFlag , setGameInstallInstrUpdateFlag] = useState(false);


    const navigate = useNavigate();

    const fetchGames = async () => {
        console.log("In fetchGames ...");
        try {
            const response = await axios.get(`http://localhost:8080/api/games/getGameDetailsByName/${gameName}`);
            console.log("Response : ", response.data);
            if (!response.data) {
                console.error("No games data found.");
                return;
            }

            setGameInfo(response.data);
            // Map and set gameCoverImage
            const gamesWithImageURL = response.data.gameCoverImage && response.data.gameCoverImage.data
                ? `data:image/png;base64,${response.data.gameCoverImage.data}` // Use the base64 image if available
                : `/no_image.png`; // Fallback to the public 'no_image.png'
            setGameCoverImage(gamesWithImageURL);

            // Set other game images
            setGameFirstSs(response.data.gameFirstScreenshot && response.data.gameFirstScreenshot.data
                ? `data:image/png;base64,${response.data.gameFirstScreenshot.data}`
                : `/no_image.png`);

            setGameSecondSs(response.data.gameSecondScreenshot && response.data.gameSecondScreenshot.data
                ? `data:image/png;base64,${response.data.gameSecondScreenshot.data}`
                : `/no_image.png`);
            setUserName(response.data.userName);
            setGameDescription(response.data.gameDescription);
            setGameInstallInstruction(response.data.gameInstallInstruction);
        } catch (error) {
            console.error("Error fetching games:", error);
            alert("Failed to load games.");
        }
    };

    const fetchGameFile = async (gameName) => {
        try {
            const fileResponse = await axios.get(
                `http://localhost:8080/api/games/getGameFileByGameName/${gameName}`,
                { responseType: "arraybuffer" } // Fetch as binary data
            );

            console.log("Response: ", fileResponse);

            if (!fileResponse.data) {
                console.error("No game file data found.");
                return;
            }

            // Create a Blob from the binary data
            const blob = new Blob([fileResponse.data], { type: "application/zip" });

            // Generate a temporary download link
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `${gameName}.zip`; // File name for download
            document.body.appendChild(link); // Append the link to the body
            link.click(); // Simulate a click to download the file
            document.body.removeChild(link); // Remove the link after download
            URL.revokeObjectURL(downloadUrl); // Clean up the URL object
        } catch (error) {
            console.error("Error fetching game file:", error);
            alert("Failed to load game file.");
        }
        try {
            const gameDownloadCount = await axios.put(`http://localhost:8080/api/games/updateGameDownloadCount/${gameName}`);
            console.log(gameDownloadCount);
        } catch (e) {
            console.log("Error updating gameDownloadCount", e);
        }
    };

    const handlClickonUser = (event) => {
        navigate("/DashboardPage", {
            state: { userName: userName }
        });
    };

    // Add a new comment template
    const handleAddComment = () => {
        setIsAddingComment(true);
    };

    const handleSaveComment = (text, index, cancelIndex) => {
        console.log("The handleSaveComment text : ", text, " and Index: ", index, "cancelIndex: ", cancelIndex, " comments : ", comments);
        if (index === undefined) {
            console.log("This is in if");
            const newComment = { id: Date.now(), text };
            setComments((prev) => [newComment, ...prev]);
        } else if (index !== undefined && cancelIndex == 1) {
            console.log("This is in else if => index : ", index, " and text : ", text);
            const updatedComments = [...comments];
            console.log("The previous text : ", updatedComments[index].text);
            updatedComments[index].text = "t";
            setComments(updatedComments);
        }
        else {
            console.log("This is gettinig in else ....");
            const updatedComments = [...comments];
            updatedComments[index].text = text;
            setComments(updatedComments);
        }
        setIsAddingComment(false);
    };

    const handleCancelComment = (text, index) => {
        console.log(" handleCancelComment is : ", text, " and index : ", index, " comment : ", comments);
        setIsAddingComment(false);
    };

    const handleCancelCheck = (text, index) => {
        // console.log("This is check for cancel with text: " , text , " and the index : " , index);
    }

    const handleDeleteComment = (index) => {
        if (index === undefined) {
            setIsAddingComment(false); // Remove the new comment form
        } else {
            setComments((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleModifyClick = () => {
        console.log("Clicked on Modify ...");
        setGameModify((prev) => !prev);
    }

    const handleGameDescriptionChange = (e) => {
        setGameDescription(e.target.value);
        setGameDescUpdateFlag(true);
    }

    const handleGameInstallInstructionChange =(e) => {
        setGameInstallInstruction(e.target.value);
        setGameInstallInstrUpdateFlag(true);
    }

    const handleFileChange = (e,fieldName) => {
        const file = e.target.files[0];
        console.log("The file : " , file);
        setFileUpdateFlag(true);
    }

    const handleGameFirstSsChange = (e) => {
        setGameFirstSs(URL.createObjectURL(e.target.files[0]));
        setGameFirstSsUpdateFlag(true);
    }

    const handleGameCoverImageChange = (e) => {
        setGameCoverImage(URL.createObjectURL(e.target.files[0]));
        setGameCoverImageUpdateFlag(true);
    }

    const handleGameSecondSsChange = (e) => {
        setGameSecondSs(URL.createObjectURL(e.target.files[0]));
        setGameSecondSsUpdateFlag(true);
    }

    const handleSaveClick = (e) => {
        setGameModify((prev) => !prev);
        console.log("Saving the updated values ");
        // API call
        
    }
    




    useEffect(() => {
        console.log("This is GameDetails useEffect ...");
        console.log("Testing gameName : ", location.state);
        fetchGames();
        console.log("gamedetails :", gameInfo);
    }, [gameName]);

    // Refresh again to set the gameInfo variable
    useEffect(() => {
        if (gameInfo) {
            console.log("Updated gameInfo:", gameInfo);
        }
    }, [gameInfo]);

    return (
        <>
            <CommonHeader />
            <div className={styles.GamePage} style={{ backgroundImage: `url(${gameCoverImage})` }}>
                {gameModify ? (<><div className={styles.GameName}>
                    <button className={styles.ModifyButton} style={{display:loggedInUserName === userName ? "block":"none"}} onClick={handleModifyClick}>Modify</button>
                    <h1>{gameName}</h1>
                </div>
                <div className={styles.GameInfo}>
                    <div className={styles.GameImages}>
                        <div className={styles.gameCoverImage} style={{ backgroundImage: `url(${gameCoverImage})` }}></div>
                        <div className={styles.GameScreenshots}>
                            <div className={styles.FirstGameScreenshot} ><img className={styles.ImageSS} src={gameFirstSs}></img></div>
                            <div className={styles.SecondGameScreenshot}><img className={styles.ImageSS} src={gameSecondSs}></img></div>
                        </div>
                    </div>
                    <div className={styles.GameDetailsInfo}>
                        <h3 className={styles.GameInfoH3}>Game Name: {gameInfo?.gameName || "Loading..."}</h3>
                        <h3 className={styles.GameInfoH3} onClick={handlClickonUser}>Game Author: {userName || "Loading..."}</h3>
                        <div className={styles.ScrollableTextArea}>
                            <h3>Description:</h3>
                            <textarea
                                value={gameInfo?.gameDescription || "The best game that you never played before"}
                                readOnly
                            />
                        </div>
                        <div className={styles.ScrollableTextArea}>
                            <h3>Install Instruction:</h3>
                            <textarea
                                value={gameInfo?.gameInstallInstruction || "Download the game."}
                                readOnly
                            />
                        </div>
                        <div className={styles.GameHeader} style={{ display: gameInfo?.gameFileId ? "flex" : "none" }}>
                            <button onClick={() => fetchGameFile(`${gameInfo.gameName}`)}>Download</button>
                            <h3>{gameName}.zip</h3>
                        </div>
                    </div>
                </div>
                    <div className={styles.GameComments}>
                        <div className={styles.GameCommentsActionButtons}>
                            <h2>Comments</h2>
                            <button className={styles.addCommentButton}>
                                <AddCommentIcon sx={{ fontSize: 41 }} onClick={handleAddComment} />
                            </button>
                        </div>
                        <div className={styles.GameCommentBox}>
                            <div className={styles.gameCommentsContainer}>
                                <div className={styles.gameComments}>
                                    {isAddingComment && (
                                        <CommentTemplate
                                            // onSave={(text) => handleSaveComment(text)}
                                            onSave={(text) => handleSaveComment(text, undefined)}
                                            onCancel={(text) => handleCancelComment(text)}
                                            onDelete={() => handleDeleteComment(undefined)} // For new comment form
                                        />
                                    )}
                                    {comments.map((comment, index) => (
                                        <CommentTemplate
                                            key={comment.id}
                                            comment={comment}
                                            // onSave={(text) => handleSaveComment(text, index)}
                                            onSave={(text, index, cancelIndex) => handleSaveComment(text, index, cancelIndex)}
                                            onEditCancel={handleCancelCheck()}
                                            onDelete={() => handleDeleteComment(index)}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>) :
                    (<><div className={styles.GameName}>
                        <button className={styles.SaveButton} onClick={handleSaveClick}>Save</button>
                        <h1>{gameName}</h1>
                    </div>
                    <div className={styles.GameInfo}>
                        <div className={styles.GameImages}>
                            <div className={styles.gameCoverImage} style={{border: "#3a657a57 4px solid"}}><img className={styles.ImageSS} src={gameCoverImage}></img></div>
                            <input
                                className={styles.ImageInputFields}
                                type="file"
                                id="gameCoverImage"
                                name="gameCoverImage"
                                accept="image/*"
                                ref={(input) => fileInputRefs?.current && (fileInputRefs.current["gameCoverImage"] = input)}
                                onChange={(e) => handleGameCoverImageChange(e)}
                            />
                            <div className={styles.GameScreenshots}>
                                <div className={styles.FirstGameSsDiv}>
                                <div className={styles.FirstGameScreenshot} style={{border: "#3a657a57 4px solid"}}><img className={styles.ImageSS} src={gameFirstSs}></img></div>
                                <input
                                    className={styles.ImageInputFields}
                                    type="file"
                                    id="gameFirstSs"
                                    name="gameFirstSs"
                                    accept="image/*"
                                    ref={(input) => fileInputRefs?.current && (fileInputRefs.current["gameFirstSs"] = input)}
                                    onChange={(e) => handleGameFirstSsChange(e)}
                                />
                                </div>
                                <div className={styles.SecondGameSsDiv}>
                                <div className={styles.SecondGameScreenshot} style={{border: "#3a657a57 4px solid"}}><img className={styles.ImageSS} src={gameSecondSs}></img></div>
                                <input
                                    className={styles.ImageInputFields}
                                    type="file"
                                    id="gameSecondSs"
                                    name="gameSecondSs"
                                    accept="image/*"
                                    ref={(input) => fileInputRefs?.current && (fileInputRefs.current["gameSecondSs"] = input)}
                                    onChange={(e) => handleGameSecondSsChange(e)}
                                />
                                </div>
                            </div>
                        </div>
                        <div className={styles.GameDetailsInfo}>
                            <h3 className={styles.GameInfoH3}>Game Name: {gameInfo?.gameName || "Loading..."}</h3>
                            <h3 className={styles.GameInfoH3} onClick={handlClickonUser}>Game Author: {userName || "Loading..."}</h3>
                            <div className={styles.ScrollableTextArea}>
                                <h3 style={{color:"#aae2ff"}}>Description:</h3>
                                <textarea
                                    value={gameDescription || "The best game that you never played before"}
                                    name="gameDescription"
                                    onChange={handleGameDescriptionChange}
                                />
                            </div>
                            <div className={styles.ScrollableTextArea}>
                                <h3 style={{color:"#aae2ff"}}>Install Instruction:</h3>
                                <textarea
                                    value={gameInstallInstruction || "Download the game."}
                                    name="gameInstallInstruction"
                                    onChange={handleGameInstallInstructionChange}
                                />
                            </div>
                            <div className={styles.GameHeader} style={{marginTop : "20px"}}>
                                <label className={styles.formLabel} htmlFor="gameFile" style={{color:"#aae2ff"}}>Game File (ZIP):</label>
                                <input
                                    className={styles.ImageInputFields}
                                    type="file"
                                    id="gameFile"
                                    name="gameFile"
                                    accept=".zip"
                                    ref={(input) => fileInputRefs?.current && (fileInputRefs.current["gameFile"] = input)}
                                    onChange={(e) => handleFileChange(e, "gameFile")}
                                />
                            </div>
                        </div>
                    </div>
                        <div className={styles.GameComments}>
                            <div className={styles.GameCommentsActionButtons}>
                                <h2>Comments</h2>
                                <button className={styles.addCommentButton}>
                                    <AddCommentIcon sx={{ fontSize: 41 }} onClick={handleAddComment} />
                                </button>
                            </div>
                            <div className={styles.GameCommentBox}>
                                <div className={styles.gameCommentsContainer}>
                                    <div className={styles.gameComments}>
                                        {isAddingComment && (
                                            <CommentTemplate
                                                // onSave={(text) => handleSaveComment(text)}
                                                onSave={(text) => handleSaveComment(text, undefined)}
                                                onCancel={(text) => handleCancelComment(text)}
                                                onDelete={() => handleDeleteComment(undefined)} // For new comment form
                                            />
                                        )}
                                        {comments.map((comment, index) => (
                                            <CommentTemplate
                                                key={comment.id}
                                                comment={comment}
                                                // onSave={(text) => handleSaveComment(text, index)}
                                                onSave={(text, index, cancelIndex) => handleSaveComment(text, index, cancelIndex)}
                                                onEditCancel={handleCancelCheck()}
                                                onDelete={() => handleDeleteComment(index)}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>)
                }

            </div>
        </>
    );
}

export default GameDetails;
