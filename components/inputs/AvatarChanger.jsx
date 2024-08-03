import Image from "next/image";
import { useState } from "react";

function AvatarChanger({ currentImage, onImageChange }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="">
      <div className="relative flex flex-col gap-3 items-center justify-center">
        <Image
          src={currentImage}
          alt="Profile Avatar"
          height={250}
          width={250}
          className="w-24 h-24 rounded-full border border-gray-300 object-cover"
        />
        <input
          type="file"
          accept="image/*"
          id="avatarInput"
          className="absolute bottom-0 opacity-0 cursor-pointer"
          onChange={(e) => onImageChange(e.target.files[0])}
        />
        <label htmlFor="avatarInput">Change Avatar</label>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-80">
            <div className="text-lg font-semibold mb-2">
              Preview and Confirm
            </div>
            <img
              src={previewUrl || "/default-avatar.png"}
              alt="Preview"
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleCancelChange}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmChange}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarChanger;
