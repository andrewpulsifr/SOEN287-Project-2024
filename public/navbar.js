

function loggedinAs() {
    const authType = localStorage.getItem('auth');
    const navbar = document.getElementById('navlink');
    navbar.innerHTML = "";
    
    console.log(authType);



    if (authType == 'admin') {
        navbar.innerHTML += `
         <ul class="nav-list">
         <li><a href="home.html"><button>Home</button><a></li>
         <li><a href="business-analytics.html"><button>Analytics</button><a></li>
         <li><a href="about.html"><button>About</button><a></li>
         <li><a href="services-business.html"><button>Services</button><a></li>
         <li><a href="business-config.html"><button>Profile</button><a></li>
         <li><button class="logout"">Logout</button></li>
         </ul>
         `;
    }
    if(authType == 'client'){
        navbar.innerHTML += `<ul>
        <li><a href="home.html"><button>Home</button><a></li>
        <li><a href="about.html"><button>About</button><a></li>
        <li><a href="services.html"><button>Services</button><a></li>
        <li><a href="profile.html"><button>Profile</button><a></li>
        <li><button class="logout">Logout</button></li>
        </ul>
        `;

    }
    if(authType == null)
    {
        navbar.innerHTML += `<ul>
        <li><a href="home.html"><button>Home</button></a></li>
        <li><a href="about.html"><button>About</button></a></li>
        <li><a href="./Login/client-sign-up.html"><button>Register</button></a></li>
        <li><a href="./Login/client-login.html"><button>Login</button></a></li>
        </ul>
        `;
    }

}

document.addEventListener('DOMContentLoaded', loggedinAs);