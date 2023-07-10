import { Avatar } from "@material-tailwind/react";

function AvaIcon(props) {
  const { link, name } = props;

  function handleClick() {
    let url = "https://github.com/" + name;
    window.open(url, "_blank");
  }

  return (
    <Avatar
      variant="circular"
      alt="user"
      className="border-2 border-white hover:z-10 focus:z-10 cursor-pointer"
      src={link}
      onClick={handleClick}
    />
  );
}

export default AvaIcon;