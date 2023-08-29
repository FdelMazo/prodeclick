export const fetchParticipants = async (cb) => {
    const response = await fetch("/api/participants");
    await response.json().then(cb).catch((err) => alert(err));
}

export const setProde = async (data) => {
    return fetch("/api/participants", {
            method: 'PUT',
            body: JSON.stringify({ prode: data })
    });
};
