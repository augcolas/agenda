import { useState } from "react";

import { type Event } from "../../models/Event";

interface CreateEventModalProps {
  closeModal: () => void; // Fonction pour fermer la modale
  eventDate: Date;
  setEvent: (event: Event) => void; // Fonction pour retourner l'événement créé
  userId: number; // ID de l'utilisateur actuel
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ userId, eventDate, setEvent, closeModal }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [additionalUserId, setAdditionalUserId] = useState<string>(""); // ID utilisateur à ajouter
  const [userIds, setUserIds] = useState<number[]>([userId]); // Initialiser avec l'utilisateur actuel
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs

  const handleAddUser = () => {
    const id = Number.parseInt(additionalUserId, 10);
    if (Number.isNaN(id)) {
      setError("L'ID utilisateur doit être un nombre.");
      return;
    }
    if (userIds.includes(id)) {
      setError("L'utilisateur est déjà ajouté.");
      return;
    }
    setUserIds([...userIds, id]); // Ajouter l'ID à la liste des utilisateurs
    setAdditionalUserId(""); // Réinitialiser le champ
    setError(null); // Réinitialiser les erreurs
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    if (!description.trim()) {
      setError("La description est obligatoire.");
      return;
    }

    const newEvent: Event = {
      date: eventDate,
      title,
      description,
      userIds,
    };

    setEvent(newEvent);
    closeModal(); // Fermer la modale après la création
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeModal}>
          &times;
        </button>
        <h2 className="modal-title">Créer un Événement</h2>
        {error && <div className="modal-error">{error}</div>}
        <div className="modal-field">
          <label className="modal-label">Titre:</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titre de l'événement"
            className="modal-input"
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">Description:</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description de l'événement"
            className="modal-textarea"
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">Ajouter un utilisateur (ID):</label>
          <div className="modal-user-add">
            <input
              type="text"
              value={additionalUserId}
              onChange={(event) => setAdditionalUserId(event.target.value)}
              placeholder="ID utilisateur"
              className="modal-input"
            />
            <button type="button" onClick={handleAddUser} className="modal-add-btn">
              Ajouter
            </button>
          </div>
        </div>
        <div className="modal-participants">
          <h4>Participants:</h4>
          <ul className="modal-participants-list">
            {userIds.map((id) => (
              <li key={id} className="modal-participant">
                Utilisateur ID: {id}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleSubmit} className="modal-submit-btn">
          Créer l Événement
        </button>
      </div>
    </div>
  );
};

export default CreateEventModal;
