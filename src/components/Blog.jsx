import BlogCard from "./blogFiles/BlogCard";


function Blog(){
    return (
        <div className="flex flex-col space-x-6 justify-center items-center">
            <p className="font-custom text-6xl">Blogs & Articles</p>
            <div id="Blog" className="pt-8 flex justify-center items-center space-x-5">
                <BlogCard 
                title="10 Must know Tips for the PTE examination"
                description= "The Pearson Test of English (PTE) is a crucial English proficiency test for those looking to study or work in an English-speaking country. This guide offers essential tips and strategies tailored to your PTE preparation, empowering you to excel in every module. Embark on this transformative journey and unlock new horizons of success!"
                image = "/images/pte.jpg"
                page = "/blogs/10-best-tips-for-the-PTE-examination"
                />
                <BlogCard
                title="Best FREE resources to Ace the Digital-SAT" 
                description= "Preparing for the SAT exam can be a daunting task, but with the right resources and strategies, you can achieve your target score. In this guide, we introduce you to some of the top YouTube channels for SAT prep. These channels offer a diverse range of resources, including practice questions, tips, and strategies, to help you improve your scores in every module."
                image = "/images/SAT.svg"
                page="/blogs/best-free-resources-for-the-digital-SAT"
                />
            </div>
        </div>
    )
}

export default Blog