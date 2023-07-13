

const ArticleImage = ({ src, alt }) => {
  return (
    <div className="my-8">
      <img src={src} alt={alt} className="rounded-lg shadow-lg" />
    </div>
  );
};

export default ArticleImage;