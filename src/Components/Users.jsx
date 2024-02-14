import PropTypes from "prop-types";
import Avatar from "./Avatar";

const Users = ({ userId, selected, onClick, userName, online }) => {
  return (
    <div
      className={`flex items-center gap-2 py-2  cursor-pointer ${
        userId === selected && "bg-blue-100  pl-2 rounded-s-2xl"
      }`}
      onClick={() => onClick(userId)}
    >
      <Avatar userName={userName} userId={userId} online={online}></Avatar>
      {userName}
    </div>
  );
};

Users.propTypes = {
  userId: PropTypes.string,
  selected: PropTypes.string,
  onClick: PropTypes.func,
  userName: PropTypes.string,
  online: PropTypes.bool,
};

export default Users;
