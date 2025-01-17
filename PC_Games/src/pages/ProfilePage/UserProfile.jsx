import { useEffect, useState } from "react";
import {useLocation } from "react-router-dom";
import CommonHeader from "../../components/PageHeader/CommonHeader";
import styles from "./UserProfile.module.css";
import axios from "axios";
import { data } from "react-router-dom";

function UserProfile(props) {
  const location = useLocation();
  const loggedInUser = location?.state?.loggedInUserName || "KC";
  const [profileImage, setProfileImage] = useState("/check_image.jpg");
  const [profileBackgroundImage, setProfileBackgroundImage] = useState(`url("no_image.png")`);
  const [userFullName, setuserFullName] = useState("Pratham");
  const [userName, setUserName] = useState("PC");
  const [userEmail, setUserEmail] = useState("kc@gmail.com");
  const [resetPassword, setResetPassword] = useState(false);
  const [userPreviousPassword, setUserPreviousPassword] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    try{
      const userData = new FormData();
      userData.append("userName" , userName);
      userData.append("userFullName" , userFullName);
      userData.append("userEmail" , userEmail);
      const response = await axios.put(`http://localhost:8080/api/users/updateUserInfoByName/${loggedInUser}`,userData , {
        headers: {
          'Content-Type': 'application/json', // Set Content-Type to application/json
        },
      }
    );
    console.log("UserInfo update API response : " , response); 
    }catch(e){
        console.log("UserInfo API Error : " , e);
    }
    showPopup("Profile updated successfully!", "success");
   };

  const handlePasswordReset = () => {
    if (userPreviousPassword !== enteredPassword) {
      showPopup("The password is wrong", "error");
      return;
    }
    setResetPassword(true);
    setEnteredPassword("");
  };

  const handleSaveNewPassword = async() => {
    if (newPassword !== confirmPassword) {
      showPopup("Passwords do not match!", "error");
      return;
    }
    else if (newPassword === userPreviousPassword) {
      showPopup("Enter a new Password !", "error");
      return;
    }
    else if(newPassword === ""){
      showPopup("Password should not be empty !","error");
      return;
    }
    try{
      const updateMessage = await axios.put(`http://localhost:8080/api/users/updateUserPasswordByName/${loggedInUser}`,newPassword, // Pass the string directly
        {
          headers: {
            'Content-Type': 'text/plain', // Ensure the Content-Type matches what your API expects
          },
        }
      );
      console.log("Password Update API Response : " , updateMessage);
      showPopup("Password updated successfully!", "success");
    }catch(e){
      console.log("The Error : " , e);
    }
    setResetPassword(false);
    setUserPreviousPassword(newPassword);
    setNewPassword("");
    setConfirmPassword("");
  };
  const handleCancelPassword = () => {
    setResetPassword(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleProfileImageChange = async(e) => {
    const file = URL.createObjectURL(e.target.files[0]);
    if (file) {
      setProfileImage(file);
      try{
          const userImagesData = new FormData();
          userImagesData.append("userProfileImage" , e.target.files[0]);
          const response = await axios.put(`http://localhost:8080/api/users/updateUserProfileImageByName/${loggedInUser}`,userImagesData, {
            headers: {
              "Content-Type": "multipart/form-data"
          }
          });
          console.log("The UpdateImage API response : " , response);
      }catch(e){
        console.log("The UpdateProfileImage API Error : " , e);
        
      }
    }
  };

  const handleBgImageChange = async(e) => {
    console.log("The file format : " , e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileBackgroundImage(`url(${event.target.result})`);
      };
      reader.readAsDataURL(file); // Converts file to base64 data URL

      //API call
      try{
        const userImagesData = new FormData();
        userImagesData.append("userProfileBgImage", file != null ? e.target.files[0]:null);
        const response = await axios.put(`http://localhost:8080/api/users/updateUserProfileBgImageByName/${loggedInUser}`,userImagesData, {
          headers: {
            "Content-Type": "multipart/form-data"
        }
        });
        console.log("The UpdateImage API response : " , response);
    }catch(e){
      console.log("The UpdateProfileBgImage API Error : " , e);
      
    }
    }
  };

  const showPopup = (message, type) => {
    const popup = document.createElement("div");
    popup.className = type === "success" ? styles.successPopup : styles.errorPopup;
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 3000);
  };

  const fetchUser = async () => {
    try{
      const response = await axios.get(`http://localhost:8080/api/users/getUserByName/${loggedInUser}`);
      if(!response.data){
        console.error("No Users Data Found.");
        return;
      }
      console.log("The data : " , response);
      setUserName(response.data.userName);
      setuserFullName(response.data.userFullName);
      setUserEmail(response.data.userEmail);
      setUserPreviousPassword(response.data.userPassword);
      setProfileImage(response.data.userProfileImage && response.data.userProfileImage.data
        ? `data:image/jpg;base64,${response.data.userProfileImage.data}` // Use the base64 image if available
        : `/no_image.png`);
      setProfileBackgroundImage(`url(data:image/jpg;base64,${response.data.userProfileBgImage.data})`);

    }catch(e){
      console.log("User Fetching Error : " , e);
    }
  }

  useEffect(()=>{
    console.log("Feching the User : " , loggedInUser);
    fetchUser();
  },[]);

  return (
    <>
      <CommonHeader />
      <div className={styles.ProfileContainer}>
        <h3 className={styles.ProfileContainerHeaderText}>Update Your Profile</h3>
        <div className={styles.UserDetailsBox}>
          {/* Profile Picture */}
          <div className={styles.ProfileImageInfoCnt}>
            <div id="ProfileImageContainer" className={styles.ProfileImageContainer} style={{ backgroundImage: profileBackgroundImage }}>
              <img
                src={profileImage || "/default-profile.png"}
                alt="Profile"
                className={styles.ProfileImage}
              />
              <div className={styles.ProFileImageInputs}>
                <label className={styles.ProfileImageLabel} htmlFor="profileImageLabel" style={{ padding: "5px 10px" }}>
                  Select Profile Image
                </label>
                <input id="profileImageLabel" style={{ width: 20, visibility: "hidden" }} type={"file"} onChange={handleProfileImageChange} />

                <label className={styles.ProfileBgImageLabel} htmlFor="profileBgImageLabel" style={{ padding: "5px 10px" }}>
                  Select Background Image
                </label>
                <input id="profileBgImageLabel" style={{ width: 20, visibility: "hidden" }} type={"file"} onChange={handleBgImageChange} />
              </div>
            </div>
            <div className={styles.ProfileUserInfo}>
              {/* User Info Form */}
              <form className={styles.UserInfo} onSubmit={handleFormSubmit}>
                <div className={styles.FormRow}>
                  <label htmlFor="userFullName">Full Name:</label>
                  <input className={styles.inputFields}
                    type="text"
                    value={userFullName}
                    onChange={(e) => setuserFullName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.FormRow}>
                  <label htmlFor="userName">Username:</label>
                  <input className={styles.inputFields}
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.FormRow}>
                  <label htmlFor="userEmail">Email:</label>
                  <input className={styles.inputFields}
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
                <button className={styles.formSubmitButton} type="submit">Save Profile</button>
              </form>
            </div>
          </div>

          {/* Reset Password */}
          <div className={styles.ResetPasswordSection}>
            <h4>Reset Password</h4>
            {resetPassword ? (
              <>
                <label htmlFor="newPassword">New Password:</label>
                <input className={styles.inputFields}
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">Confirm New Password:</label>
                <input className={styles.inputFields}
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {/* cancel */}
                <button className={styles.cancelPasswordButton} onClick={handleCancelPassword}>Cancel</button>
                {/* save new password */}
                <button className={styles.resetPasswordSaveButton} onClick={handleSaveNewPassword}>Save</button> 
              </>
            ) : (
              <>
                <label htmlFor="enteredPassword">Enter Previous Password:</label>
                <input className={styles.inputFields}
                  type="text"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                />
                <button className={styles.formVerifyButton} onClick={handlePasswordReset}>Verify Password</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
