

function MyContribution(props){
    let info
    switch(props.repo){
        case "Danime":
            info = "Owner, Lead Developer and Manager"
            break;
        case "Abode":
            info = "Owner and Developer"
            break;
        
        case "Calculator":
            info = "Owner and Developer"
            break;
        
        case "Quotient-Bot":
            info = "Support and Issues"
            break;
        
        default:
            info="Unknown"
            break;
    }

    return (
        <h1 className="pl-2">{info}</h1>
    )
}

export default MyContribution