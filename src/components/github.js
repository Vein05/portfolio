import { Octokit } from "@octokit/rest";
const octokit = new Octokit({
  auth: `${process.env.REACT_APP_GITHUB_KEY}`,
});



export async function getRepositoryStats(repo) {
  let userData = await octokit.users.getAuthenticated();
  let owner = userData.data.login;
  if(repo==="Danime"){
    owner = "Danimebot"
    repo = "Danime"
  }
  if (repo==="Quotient-Bot"){
    owner = "quotientbot"
    repo="Quotient-Bot"
  }
  try {
    const response = await octokit.repos.get({
      owner,
      repo,
    });

    const description = response.data.description;
    const totalStars = response.data.stargazers_count;
    const fullName = response.data.full_name || NaN;
    const contributors = await octokit.repos.listContributors({
      owner,
      repo,
    });

    const contributorData = contributors.data.slice(0,6).map((contributor) => {
      if (contributor.login.includes("deepsource")) {
        return null
      }
      return {
        name: contributor.login,
        avatarUrl: contributor.avatar_url,
      };

    }).filter(contributor => contributor !== null);

    return {
      fullName,
      repo,
      // totalCommits,
      totalStars,
      description,
      contributors: contributorData,
    };
  } catch (error) {
    console.error("Error occurred while fetching repository stats:", error);
  }
}
