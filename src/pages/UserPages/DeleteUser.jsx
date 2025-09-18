import React, { useState } from "react";
import { useUser } from "../../shared/hooks/User/useUser.jsx";
import { StarsBackground } from "../../components/molecules/StarsBackground.jsx";

export const DeleteUser = () => {
  const [showModal, setShowModal] = useState(false);
  const { deleteProfile } = useUser();

  const handleDelete = (e) => {
    e.preventDefault();
    deleteProfile();
    setShowModal(false);
  };

  return (
    <div>
      {/* Botón de eliminar perfil - rojo */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Eliminar perfil
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <StarsBackground />
          <div className="bg-gray-800/90 p-6 rounded-lg w-96 z-10">
            <h3 className="text-lg font-semibold mb-2 text-white">
              ¿Estás seguro de querer eliminar tu perfil?
            </h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded text-white bg-red-300 bg-red-500 hover:bg-red-600"
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setConfirmationText("");
                  setDisable(true);
                }}
                className="bg-blue-700 hover:bg-sky-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};