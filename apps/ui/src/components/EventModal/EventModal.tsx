import { useState } from "react";

import { type Event } from "../../models/Event";
import "./EventModal.css";

interface EventModalProps {
  eventDate: Date;
  eventToUpdate: Event | null;
  handleAddEvent: (event: Event) => void;
  handleCloseModal: () => void;
  handleRDeleteEvent: (eventId: number) => void;
  handleUpdateEvent: (event: Event) => void;
  userId: number;
}

const EventModal: React.FC<EventModalProps> = ({
  userId,
  eventDate,
  handleAddEvent,
  handleUpdateEvent,
  handleRDeleteEvent,
  handleCloseModal,
  eventToUpdate
}) => {
  const [title, setTitle] = useState<string>(eventToUpdate ? eventToUpdate.title : "");
  const [description, setDescription] = useState<string>(eventToUpdate ? eventToUpdate.description : "");
  const [additionalUserId, setAdditionalUserId] = useState<string>("");
  const [userIds, setUserIds] = useState<number[]>(
    eventToUpdate ? eventToUpdate.userIds : [userId]
  );
  const [error, setError] = useState<string | null>(null);

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
    setUserIds([...userIds, id]);
    setAdditionalUserId("");
    setError(null);
  };

  const handleSubmit = (deleteEvent : boolean) : void => {

    if(deleteEvent && eventToUpdate?.id){
      handleRDeleteEvent(eventToUpdate?.id);
      handleCloseModal();
      return
    }
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

    if(eventToUpdate?.id) {
      handleUpdateEvent({...newEvent, id: eventToUpdate.id});
    }else{
      handleAddEvent(newEvent);
    }
    handleCloseModal();
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>

        <button className="modal-close-btn" onClick={handleCloseModal}>
          &times;
        </button>

        <h2 className="modal-title">{eventToUpdate ? "Mettre à jour l'événement" : "Créer un événement"}</h2>

        {error && <div className="modal-error">{error}</div>}

        <div className="modal-field">
          <label className="modal-label">Titre:</label>
          <input
            type="text"
            value={ title }
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

                {id !== userId && (
                  <button
                    type="button"
                    onClick={() => setUserIds(userIds.filter((userToFilterId) => userToFilterId !== id))}
                    className="modal-remove-btn"
                  >
                    Supprimer
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => handleSubmit(false)} className="modal-submit-btn">
          {eventToUpdate ? "Mettre a jour" : "Créer l Événement"}
        </button>

        {eventToUpdate && (
          <button
            onClick={() => handleSubmit(true)}
            className="modal-delete-btn"
          >
            Supprimer l&apos;événement
          </button>
        )}
      </div>
    </div>
  );
};

export default EventModal;
