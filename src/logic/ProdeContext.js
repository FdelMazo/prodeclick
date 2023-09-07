import React from "react";
import PARTIDOS from './partidos';


export const ProdeContext = React.createContext();

export const ProdeProvider = ({ children }) => {
    const prode = Prode();
    return (
        <ProdeContext.Provider value={prode}>
            {children}
        </ProdeContext.Provider>
    );
};

const Prode = () => {
    const [simulatedResults, setSimulatedResults] = React.useState(
        Object.fromEntries(PARTIDOS.map(p => [p.id, p.defaultPercentage]))
    )
    return {
        simulatedResults,
        setSimulatedResults
    };
};
