import { Fragment, useState } from "react";

import { type UserInterface } from "../../interfaces/user.interface";
import "./EventModal.css";
import { type AddEvent, type Event, type UpdateEvent } from "../../models/Event";

interface EventModalProps {
  eventDate: Date;
  eventToUpdate: Event | null;
  handleAddEvent: (event: AddEvent) => void;
  handleCloseModal: () => void;
  handleRDeleteEvent: (eventId: number) => void;
  handleUpdateEvent: (event: UpdateEvent) => void;
  user: UserInterface;
  users: UserInterface[];
}

const EventModal: React.FC<EventModalProps> = ({
  eventDate,
  eventToUpdate,
  handleAddEvent,
  handleCloseModal,
  handleRDeleteEvent,
  handleUpdateEvent,
  user,
  users,
}) => {
  const [title, setTitle] = useState<string>(eventToUpdate ? eventToUpdate.title : "");
  const [description, setDescription] = useState<string>(eventToUpdate ? eventToUpdate.description : "");
  const [eventUsers, setEventUsers] = useState<UserInterface[]>(
    eventToUpdate ? eventToUpdate.users : [user]
  );
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableUsers = users.filter(
    (filteredUser) =>
      filteredUser.id !== user.id &&
      !eventUsers.some((eventUser) => eventUser.id === filteredUser.id)
  );

  const handleAddUser = () => {
    if (!selectedUser) return;

    if (eventUsers.some((eventUser) => eventUser.id === selectedUser.id)) {
      setError("Cet utilisateur est déjà dans la liste.");
      return;
    }

    setEventUsers((previousUsers) => [...previousUsers, selectedUser]);
    setSelectedUser(null);
  };

  const handleSubmit = (deleteEvent: boolean): void => {
    if (deleteEvent && eventToUpdate?.id) {
      handleRDeleteEvent(eventToUpdate?.id);
      handleCloseModal();
      return;
    }

    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    if (!description.trim()) {
      setError("La description est obligatoire.");
      return;
    }

    const newEvent: AddEvent = {
      date: eventDate,
      title,
      description,
      users: eventUsers.map((eventUser) => eventUser.id),
    };

    if (eventToUpdate?.id) {
      handleUpdateEvent({ ...newEvent, id: eventToUpdate.id });
    } else {
      handleAddEvent(newEvent);
    }
    handleCloseModal();
  };

  const handleRemoveUser = (userToRemove: UserInterface) => {
    setEventUsers(eventUsers.filter((eventUser) => eventUser.id !== userToRemove.id));
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = Number.parseInt(event.target.value, 10);
    const selected = users.find((selectUser) => selectUser.id === selectedUserId) ?? null;
    setSelectedUser(selected);
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

        <div className="modal-field-full">
          <label className="modal-label">Ajouter un utilisateur:</label>
          <div className="modal-user-add">
            {availableUsers.length > 0 ? (
              <Fragment>
                <select
                  name="users"
                  id="users"
                  onChange={handleChange}
                  value={selectedUser?.id ?? ""}
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {availableUsers.map((displayedUser) => (
                    <option key={displayedUser.id} value={displayedUser.id}>
                      {displayedUser.email}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddUser} className="modal-add-btn">
                  Ajouter
                </button>
              </Fragment>
            ) : (
              <span className="modal-no-users">Aucun utilisateur disponible</span>
            )}

          </div>
        </div>

        <div className="modal-participants">
          <h4>Participants:</h4>
          <ul className="modal-participants-list">
            {eventUsers.map((eventUser) => (
              <li key={eventUser.id} className="modal-participant">
                {eventUser.email}
                {user.id !== eventUser.id && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(eventUser)}
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
          {eventToUpdate ? "Mettre à jour" : "Créer l'Événement"}
        </button>

        {eventToUpdate && (
          <button onClick={() => handleSubmit(true)} className="modal-delete-btn">
            Supprimer l&apos;événement
          </button>
        )}
      </div>
    </div>
  );
};

export default EventModal;
