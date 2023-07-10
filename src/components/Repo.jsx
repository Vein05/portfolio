import { getRepositoryStats } from "./github";
import { useEffect, useState } from "react";
import RepoCard from "./RepoCard"


function Repo(props) {

    var repo = props.repo;

    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const statsData = await getRepositoryStats(repo);
            setStats(statsData);
        }
        fetchData();
    }, [repo]);


    if (!stats) {
        return <div>Loading...</div>;
      }

    return (
        <div className="transition-all duration-300">
            <RepoCard stats={stats}/>
        </div>

    );
}

export default Repo;