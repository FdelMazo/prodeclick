export const fetchParticipants = async (cb) => {
    const response = await fetch("/api/participant");
    await response.json().then(cb)
}

export const fetchNumberParticipants = async (cb) => {
    const response = await fetch("/api/participant?number=true");
    await response.json().then(cb)
}

export const fetchNumberParties = async (cb) => {
    const response = await fetch("/api/party");
    await response.json().then(cb)
}

export const setProde = async (data) => {
    return fetch("/api/participant", {
        method: 'PUT',
        body: JSON.stringify({ prode: data })
    });
};

export const createParty = async () => {
    const response = await fetch("/api/party", {
        method: 'POST',
        body: JSON.stringify({ apuesta: 1000 })
    });
    return response.json();
};
