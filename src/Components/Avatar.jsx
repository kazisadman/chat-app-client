import PropTypes from "prop-types";

const Avatar = ({ userName, userId }) => {
  const colors = [
    "bg-blue-600",
    "bg-red-600",
    "bg-yellow-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-gray-600",
  ];
  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  return (
    <div>
      <div
        className={`h-6 w-6 ${colors[colorIndex]} rounded-full text-center text-white font-bold cursor-pointer`}
      >
        <span>{userName[0]}</span>
      </div>
    </div>
  );
};

Avatar.propTypes = {
  userName: PropTypes.string,
  userId: PropTypes.string,
};

export default Avatar;
