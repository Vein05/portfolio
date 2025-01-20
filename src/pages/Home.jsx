function Home() {
  return (
    <div className="page flex justify-center">
      <div className="resume-container max-w-2xl w-full m-2 p-2">
        <div className="introduction flex flex-col justify-center items-center">
          <span className="text-4xl font-bold">Sugam Panthi</span>
          <span className="italic text-sm">
            Software Developer | Research Assistant @ The University of Southern Mississippi
          </span>
        </div>
        <div className="middle flex flex-col justify-between lg:flex lg:flex-row">
          <div className="about">
            <span className="underline flex text-sm font-bold">
              <img src="/images/person.png" className="h-5 w-5" alt="person"/>
              About me
            </span>
          </div>
          <div className="education">
            <span className="underline flex text-sm font-bold">
              <img src="/images/university.png" className="h-5 w-5" alt="person"/>
              Education
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;