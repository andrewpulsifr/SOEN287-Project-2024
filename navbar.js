

function loggedinAs() {
    let loggedinAs = localStorage.getItem('loggedinAs');
    const navbar = document.getElementById('navlink');
    loggedinAs = null;

    
    
    
    console.log(loggedinAs);
    


    if (loggedinAs == 'business') {
        navbar.innerHTML += `
         <ul>
         <li><a href="home.html"><button>Home</button><a></li>
         <li><a href="home.html"><button>Analytics</button><a></li>
         <li><a href="about.html"><button>About</button><a></li>
         <li><a href="services.html"><button>Services</button><a></li>
         <li><a href="profile.html"><button>Profile</button><a></li>
         <li><button onclick="logout()">Logout</button></li>
         </ul>
         `;
    }
    if(loggedinAs == 'client'){
        navbar.innerHTML += `<ul>
        <li><a href="home.html"><button>Home</button><a></li>
        <li><a href="about.html"><button>About</button><a></li>
        <li><a href="services.html"><button>Services</button><a></li>
        <li><a href="profile.html"><button>Profile</button><a></li>
        <li><button onclick="logout()">Logout</button></li>
        </ul>
        `;

    }
    if(loggedinAs == null)
    {
        console.log('hello');
        navbar.innerHTML += `<ul>
        <li><a href="home.html"><button>Home</button></a></li>
        <li><a href="about.html"><button>About</button></a></li>
        <li><a href="register.html"><button>Register</button></a></li>
        <li><a href="login.html"><button>Login</button></a></li>
        </ul>
        `;



    }

}
function logout() {
    loggedinAs = null;
    window.location.href = 'home.html';
}
document.addEventListener('DOMContentLoaded', loggedinAs);