const nodeUrl = "http://localhost:4001";
export const checkRoom = async (id: string) => {
    try {
        const response = await fetch(`${nodeUrl}/api/room/${id}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            if (data.error) return Error((data.error = data.message));
        } else {
            return Error("Failed to fetch room data");
        }
    } catch (error) {
        return error;
    }
};
