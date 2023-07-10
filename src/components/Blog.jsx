import BlogCard from "./blogFiles/BlogCard";


function Blog(){
    return (
        <div id="Blog" className="pt-8 flex justify-center items-center space-x-5">
            <BlogCard 
            title="10 Must know Tips for the PTE examination"
            description= "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam minus magni maiores autem eius dolorem, obcaecati error repellendus veritatis quasi iste voluptatum. Porro et deleniti maxime ex ducimus nulla eligendi!"
            image = "./images/pte.jpg"
            
            />
            <BlogCard
            title="Best FREE resources to Ace the Digital-SAT" 
            description= "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam minus magni maiores autem eius dolorem, obcaecati error repellendus veritatis quasi iste voluptatum. Porro et deleniti maxime ex ducimus nulla eligendi!"
            image = "./images/SAT.svg"
            />
        </div>
    )
}

export default Blog