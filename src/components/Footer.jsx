import image from "../images/expand.svg";
import { useRef, useEffect } from "react";

function Footer(props) {
  const myRef = useRef(null);

  useEffect(() => {
    const element = document.querySelector(props.scrollTo);

    function handleScroll() {
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: "smooth"
        });
      }
    }

    const buttonRef = myRef.current;

    buttonRef.addEventListener("click", handleScroll);

    return () => {
      buttonRef.removeEventListener("click", handleScroll);
    };
  }, [props.scrollTo]);

  return (
    <div className="pt-5 pb-5 flex justify-center items-center text-xl">
      <button ref={myRef}>
        <img
          src={image}
          alt="Button"
          className="bg-transparent transition duration-300 hover:scale-140"
        />
      </button>
    </div>
  );
}

export default Footer;