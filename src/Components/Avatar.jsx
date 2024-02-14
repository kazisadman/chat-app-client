import PropTypes from "prop-types";

const Avatar = ({ userName, userId, online }) => {
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
        className={`h-8 w-8 ${colors[colorIndex]} rounded-full flex text-white font-bold cursor-pointer relative items-center`}
      >
        <div className="text-center w-full">{userName[0]}</div>
        {online ? (
          <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border-white border-2"></div>
        ) : (
          <div className="absolute w-3 h-3 bg-gray-500 bottom-0 right-0 rounded-full border-white border-2"></div>
        )}
      </div>
    </div>
  );
};

Avatar.propTypes = {
  userName: PropTypes.string,
  userId: PropTypes.string,
  online: PropTypes.bool,
};

export default Avatar;
