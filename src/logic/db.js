export const fetchParticipants = async (cb) => {
    const response = await fetch("/api/participants");
    const data = await response.json();
    cb(data)
};

export const setProde = async (data) => {
    const response = await fetch("/api/participants",
        {
            method: 'PUT',
            body: JSON.stringify({ prode: data })
        });
    return await response.json();
};
