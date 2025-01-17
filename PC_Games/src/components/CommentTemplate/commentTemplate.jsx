import React, { useState } from "react";
import styles from "./commentTemplate.module.css";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

function CommentTemplate(props) {
    const [isEditing, setIsEditing] = useState(!props.comment?.text);
    const [text, setText] = useState(props.comment?.text || "");
    const [prevText,setPrevText] = useState(props.comment?.text || "");
    const index = props.index !== undefined? props.index:undefined;
    const onSave = props.onSave;
    const onCancel = props.onCancel;
    const onDelete = props.onDelete;
    const [saveButtonFlag,setSaveButtonFlag] = useState(true);
    const userName = props.userName ?? "PC";

    const handleSave = () => {
        setSaveButtonFlag(true);
        console.log("In child => onSave : " , onSave , " & onCancel : " , onCancel);
        if (text.trim().length > 0) {
            console.log("index in child : " , index);
            onSave(text,index);
            setPrevText(text);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setSaveButtonFlag(false);
        const isEmpty = text.trim().length === 0; // Check if textarea is empty
        console.log("In child => text : " , text , " index : " , index , " onDelete: " , onDelete);
        if (isEmpty && onDelete && index == undefined) {
            console.log("Deleting from child");
            onDelete(); // Notify parent to delete this comment
        } else if (onCancel) {
            onCancel();
        }
        else if((!isEmpty) || (isEmpty && onDelete && index !== undefined)){
            console.log("the field is not empty in child comment");
            // onSave("",index,1);
            setText(prevText);
            setIsEditing(false);
        }
    };

    const handleSetText = (e) =>{
        const isEmpty = text.trim().length === 0;
        // if(!isEmpty && onCancel){
        //     console.log("do not set text ...");
        // }else{
        //     setText(e.target.value);
        // }
        setText(e.target.value);
    }
    
    return (
        <div className={styles.commentBox}>
            {isEditing ? (
                <>
                    <div className={styles.commentSection}>
                        <textarea
                            value={text}
                            onChange={(e) => handleSetText(e)}
                            placeholder="Write your comment..."
                        />
                    </div>
                    <div className={styles.commentSaveButtons}>
                        <button onClick={handleCancel}>Cancel</button>
                        <button onClick={handleSave}>Save</button>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.commentUpdateSection}>
                        <div className={styles.commentUpdateSectionUserName}>
                            <h5>{userName}</h5>
                        </div>
                        <div className={styles.commentUpdateSectionbuttons}>
                            <ModeEditIcon className={styles.commentUpdateEditIcon} sx={{ fontSize: 23 , width: 32 }} onClick={() => setIsEditing(true)} />
                            <DeleteIcon className={styles.commentUpdateDeleteIcon} sx={{ fontSize: 23 , width: 32}} onClick={onDelete} />
                        </div>
                    </div>
                    <div className={styles.commentSection}>
                        <p>{text}</p>
                    </div>
                </>
            )}
        </div>
    );
}



export default CommentTemplate;
