const ProfileCard = ({ profile, onAction }) => {

  return (

    <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto flex flex-col">

      {/* ... profile info JSX */}

      <div className="mt-auto flex justify-center space-x-4 pt-4">

        <button 

          onClick={() => onAction(profile._id, 'pass')}

          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"

        >

          Pass

        </button>

        <button 

          onClick={() => onAction(profile._id, 'like')}

          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"

        >

          Like

        </button>

      </div>

    </div>

  );

};


export default ProfileCard;

