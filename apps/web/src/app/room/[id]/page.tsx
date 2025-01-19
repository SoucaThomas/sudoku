"use client";
import { useParams } from "next/navigation";

const Room = () => {
    const { id } = useParams(); // Extract the dynamic `id` from the URL

    return (
        <div>
            <h1>Room ID: {id}</h1>
            {/* Use the `id` to fetch room data or display content */}
        </div>
    );
};

export default Room;
