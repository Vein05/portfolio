let quote = ["Why finish a task in 5 minutes when you can spend 5 hours trying to automate it, only to realize it would have been quicker to just do it manually in the first place?",
            "We do things not because they are easy, but because we thought they would be easy. Just to realize that we were wrong, and we're in too deep to turn back now.",
            "There are two types of people in the world: those who are normal, and those who read the documentation.",
            "6 hours of debugging can save you 5 minutes of reading documentation."
]
function Quote(){
    var q = quote[Math.floor(Math.random()*quote.length)];
    return (
        <div className="">
            <p className="text-center italic font-bold">"{q}"</p>
            <p className="text-right">-SomeProgrammer</p>
        </div>
    )
}


export default Quote