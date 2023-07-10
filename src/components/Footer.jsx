import image from "../images/expand.svg";

function Footer(props) {
  function scrollByScreen() {
    const screenHeight = window.innerHeight;
    const currentScrollPosition = window.pageYOffset;
    const newScrollPosition = currentScrollPosition + screenHeight;
    window.scrollTo({
      top: newScrollPosition,
      behavior: 'smooth'
    });
  }

  return (
    <div className="flex flex-row justify-between items-center text-xl">

      
        <p className="text-center">Hello, 25th viewer</p>
        <button>
          <img src={image} alt="Button " 
          className="bg-transparent transform transition duration-300 hover:scale-110"
          onClick={scrollByScreen}
          />
        
        </button>
        <a href="#Qualifications" class="">
          <u><span class="h-10 w-10 rounded-full hover:shadow-md shadow-white transition duration-300 transform hover:scale-105">Academic Qualifications</span></u>
        </a>    
    </div>
  );
}

export default Footer;