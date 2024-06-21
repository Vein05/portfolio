import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faJs, faPython, faReact } from '@fortawesome/free-brands-svg-icons';

function Coding() {
  return (
    <div className="flex justify-center flex-col items-center">
      <p className="pt-5 text-2xl font-custom">Let's learn some more about me</p>

      <div className="border-b-4 border-blue-800 w-1/2 pt-10 flex space-x-5 flex-col justify-center items-center lg:flex-row">
        <img
          src="https://github-readme-stats.vercel.app/api?username=vein05&show_icons=true&card=600&line_height=30&include_all_commits=true&theme=transparent&rank_icon=github"
          alt="Stats"
        />
      </div>

      <div className="text-sm pb-5 border-b-4 border-blue-800 w-1/2 flex flex-col lg:flex-row lg:space-x-10 lg:justify-center lg:items-center">
        <div className="flex flex-col items-center">
          <p className="text-2xl pt-5">I'm currently learning</p>
          <ul className="list-disc lg:pl-8 pt-2">
            <li className="flex items-center">
              <span className="lg:mr-2">&#x2192;</span>
              Web Development &#x1F4BB;
            </li>
            <li className="flex items-center">
              <span className="lg:mr-2">&#x2192;</span>
              Cross-Platform App &#x1F4F1;&#xFE0F;
            </li>
            <li className="flex items-center">
              <span className="lg:mr-2">&#x2192;</span>
              Music Theory &#x1F3B5;
            </li>
            <li className="flex items-center">
              <span className="lg:mr-2">&#x2192;</span>
              Creative Writing &#x270D;&#xFE0F;
            </li>
          </ul>
       </div>
        <div className="flex flex-col lg:items-center">
          <p className="text-2xl lg:pt-5">I Plan on learning</p>
          <ul className="list-disc lg:pl-8 pt-2">
            <li className="flex items-center">
              <span className="lg:mr-2">&#x2192;</span>
              DevOps & Systems 🛠️
            </li>
            <li className="flex items-center">
              <span className="lg:mr-2">&#x2192;</span>
              C# for heavy applications 🖥️💻
            </li>
            <li className="flex items-center">
              <span className="lg:mr-2">&#x2192;</span>
              Designing 🎨
            </li>
            <li className="flex items-center">
              <span className="lg:mr-2">&#x2192;</span>
              Piano 🎹
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-5 flex flex-col justify-center items-center">
        <p className="pb-5 text-2xl">Technologies I use</p>
        <div className="flex space-x-3">
          <FontAwesomeIcon icon={faPython} className="fa-lg h-8 w-8 rounded-md hover:scale-125 duration-200 text-gray-500" />
          <FontAwesomeIcon icon={faHtml5} className="fa-lg h-8 w-8 rounded-md hover:scale-125 duration-200 text-gray-500" />
          <FontAwesomeIcon icon={faReact} className="fa-lg h-8 w-8 rounded-md hover:scale-125 duration-200 text-gray-500" />
          <FontAwesomeIcon icon={faJs} className="fa-lg h-8 w-8 rounded-md hover:scale-125 duration-200 text-gray-500" />
          <img className="h-8 w-8 rounded-md hover:scale-125 duration-200 "src="/images/tailwind.png" alt="Tailwind" />          
          <img className="h-8 w-8 rounded-md hover:scale-125 duration-200 "src="/images/c.png" alt="C" />
        </div>
      </div>
    </div>
  );
}

export default Coding;