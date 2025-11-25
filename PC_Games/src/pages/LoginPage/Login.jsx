import styles from './Login.module.css';
import loginImage from '../../assets/5500661.jpg';
import siteLogo from '../../assets/Common_logo-removebg.png';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const RememberMe = () => {
        console.log("Clicked on RemeberMe");
    }

    const LoginAction = () => {
        console.log("Logging in ...");
        navigate("/", {state : {}});
    }

    const RegisterClick = () => {
        console.log("Redirecting to Register Page ...");
        navigate("/SignUp" , { state : {}});
    }

    return (
        <>
        <div>
              <img className="siteLogo" src={siteLogo} />
        </div>
        <div className={styles.loginPage}>
            <div className={styles.loginPageHeader}>
                <h1>Welcome to PCthings</h1>
                <h2>Log in</h2>
            </div>
            
            <div className="loginContainer">
                <img className="loginImage" src={loginImage}></img>
                <div className="loginForm">
                        <label htmlFor="uname" className='formLable'><b>Username</b></label>
                        <input type="text" className='formInput' placeholder="Enter Username" name="uname" required />
                        <label htmlFor="psw" className='formLable'><b>Password</b></label>
                        <input type="password" className='formInput' placeholder="Enter Password" name="psw" required />
                        <div className='pdText'>
                        <label className='rmField'>
                        <input type="checkbox" defaultChecked onClick={RememberMe} />Remember me
                        </label> 
                        <span className="psw">Forgot <a href="#">password?</a></span>
                        <span className="psw">Want to <a href="#" style={{color: 'green' , fontWeight : 'bold'}} onClick={RegisterClick}>Register?</a></span>
                        </div>
                        <button type="submit" className='formLogin' onClick={LoginAction}>Login</button>
                        
                </div>
            </div>
        </div>
        </>
    )
}

export default Login