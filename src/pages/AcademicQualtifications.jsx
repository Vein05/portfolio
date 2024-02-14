import Nav from '../components/Nav'

function AcademicQuantifications() {
  return (
    <div className="min-h-screen bg-main">
      <Nav />
      <div className="px-5 py-5 flex flex-col items-center space-x-5">
        <span className="text-xl">
          Before getting into my academic qualifications it's a nice idea to
          introduce my interests and the fields that I'm good at.
        </span>

        <div className="p-5 rounded-lg flex">
          <ul className="pt-5 pl-3 text-left">
            <li className="mb-2">Software Development</li>
            <li className="mb-2">Leadership</li>
            <li className="mb-2">Creativity</li>
            <li className="mb-2">Project Management</li>
            <li className="mb-2">Strong Communicational Skills</li>
            <li className="mb-2">Teamwork and adaptability</li>
          </ul>
          <div className="">
            <img
              src="/images/logo.jpg"
              className="w-72 h-72 object-top object-cover py-5 px-9"
              alt=""
            />
          </div>
        </div>

        <h1 className="text-2xl pb-9">Education Qualifications</h1>

        {/* Class 12 */}
        <div className="flex text-xl mb-12">
          <div className="flex flex-col justify-center">
            <span className="font-bold mb-2">
              School Leaving Certificate [Grade 12]
            </span>
            <span className="mb-2">➡ Kanti Secondary School - Hatbazzar</span>
            <ul className="pl-9 list-disc flex flex-col items-start justify-center">
              <li className="mb-1">
                Stream : Science
              </li>
              <li className="mb-1">
                Subjects : Computer Science, Mathematics, Physics, Chemistry,
                English and Nepali
              </li>
              <li className="mb-1">
                CGPA : 3.58/4.0 | A+ A+ A+ A+ B+ B+
                              </li>
              <li className="mb-1">
                Rank : 9/1500
              </li>
            </ul>
          </div>
        </div>

        <div className="flex text-xl">
          <div className="flex flex-col justify-center">
            <span className="font-bold mb-2">
              School Leaving Certificate [Grade 11]
            </span>
            <span className="mb-2">➡ Kanti Secondary School - Hatbazzar</span>
            <ul className="pl-9 list-disc flex flex-col items-start justify-center">
              <li className="mb-1">
                Stream : Science
              </li>
              <li className="mb-1">
                Subjects : Computer Science, Mathematics, Physics, Chemistry
                English and Nepali
              </li>
              <li className="mb-1">
                GPA : 3.72 / 4.0
              </li>
              <li className="mb-1">
                Rank : 13 / 450
              </li> 
            </ul>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AcademicQuantifications