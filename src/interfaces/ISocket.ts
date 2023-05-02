interface ServerToClientEvents {
    createPicture: (message: string) => void;
    updatePicture: (message: string) => void;
    deletePicture: (message: string) => void;
    createComment: (message: string) => void;
    updateComment: (message: string) => void;
    deleteComment: (message: string) => void;
}

interface ClientToServerEvents {
    update: (message: string) => void;
}

export {ServerToClientEvents, ClientToServerEvents}

