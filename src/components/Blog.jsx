import BlogCard from "./blogFiles/BlogCard";


function Blog(){
    return (
        <div className="flex flex-col space-x-6 justify-center items-center">
            <p className="font-custom text-6xl">Blogs & Articles</p>
            <div id="Blog" className="pt-8 flex justify-center items-center space-x-5">
                <BlogCard 
                title="10 Must know Tips for the PTE examination"
                description= "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam minus magni maiores autem eius dolorem, obcaecati error repellendus veritatis quasi iste voluptatum. Porro et deleniti maxime ex ducimus nulla eligendi!"
                image = "/images/pte.jpg"
                page = "/blogs/10-best-tips-for-the-PTE-examination"
                />
                <BlogCard
                title="Best FREE resources to Ace the Digital-SAT" 
                description= "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam minus magni maiores autem eius dolorem, obcaecati error repellendus veritatis quasi iste voluptatum. Porro et deleniti maxime ex ducimus nulla eligendi!"
                image = "/images/SAT.svg"
                page="/blogs/best-free-resources-for-the-digital-SAT"
                />
            </div>
        </div>
    )
}

export default Blog