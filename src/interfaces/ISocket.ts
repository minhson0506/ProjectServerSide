interface ServerToClientEvents {
    addPicture: (message: string) => void;
    addComment: (message: string) => void;
}

interface ClientToServerEvents {
    update: (message: string) => void;
}

export {ServerToClientEvents, ClientToServerEvents}

