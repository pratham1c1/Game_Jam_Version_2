import styles from './SignUp.module.css';
import loginImage from '../../assets/5500661.jpg';
import siteLogo from '../../assets/Common_logo-removebg.png';
import { useNavigate, useLocation } from "react-router-dom";

function SignUp() {

    const navigate = useNavigate();

    const RememberMe = () => {
        console.log("Clicked on Remember Me");
    }

    const SignUp = (e) => {
        console.log("Clicked on SignUP");
        console.log("Redirecting to Login ...");
            navigate("/Login", {
                state: {}
            });
        
    }

    return (
        <>
            <div>
                <img className={styles.siteLogo} src={siteLogo} />
            </div>
            <div className={styles.loginPage}>
                <div className={styles.loginPageHeader}>
                    <h1>Welcome to PCthings</h1>
                    <h2>Register</h2>
                </div>
                <div className={styles.loginContainer}>
                    <img className={styles.loginImage} src={loginImage}></img>
                    <div className={styles.loginForm}>
                        <label htmlFor="email" className={styles.formLable}><b>Email</b></label>
                            <input type="text" className={styles.formInput} placeholder="Enter Email" name="email" required />
                            <label htmlFor="uname" className={styles.formLable}><b>Username</b></label>
                            <input type="text" className={styles.formInput} placeholder="Enter Username" name="uname" required />
                            <label htmlFor="psw" className={styles.formLable}><b>Password</b></label>
                            <input type="password" className={styles.formInput} placeholder="Enter Password" name="psw" required />
                            <div className={styles.pdText}>
                            <label className={styles.rmField}>
                            <input type="checkbox" defaultChecked onClick={RememberMe} />Remember me
                            </label> 
                            <span className={styles.psw}>Forgot <a href="#">password?</a></span>
                            </div>
                            <button type="submit" className={styles.formLogin} onClick={SignUp}>Sign Up</button>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp