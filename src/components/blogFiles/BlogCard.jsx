function BlogCard(props) {
  const handelClick = () => {
    window.open(props.page, "_blank");
  };
  return (
    <div className="w-full lg:w-96 overflow-hidden flex-1">
      <div className="m-0 flex items-center justify-center">
        <a href="#Blog" onClick={handelClick}>
          <img className="pr w-72 lg:w-96 rounded-md bg-transparent" src={props.image} alt="" height={300} />
        </a>
      </div>
      <div className="p-4 color-main">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-500">{props.title}</h2>
        <p className="mt-3 text-base sm:text-lg font-normal text-gray">➤ {props.description}</p>
        <a href="#Blog" className="">
          <button className="mt-3 flex items-center gap-2 text-blue-500 hover:text-blue-800 focus:outline-none">
            Learn More
          </button>
        </a>
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center">
            <img src="/images/image.jpg" alt="sugam panthi" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white hover:z-10" />
            <span className="absolute bottom-0 right-0 inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 border-2 border-white rounded-full"></span>
          </div>
          <p className="hidden sm:inline-block text-gray text-sm font-medium">Sugam Panthi</p>
        </div>
        <p className="text-gray text-sm font-normal">500 👁 | July 10</p>
      </div>
    </div>
  );
}

export default BlogCard;