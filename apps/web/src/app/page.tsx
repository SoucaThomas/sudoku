import PlayerLobby from "../components/PlayerLobby";
import OpenGames from "../components/OpenGames";

export default function HomePage() {
    return (
        <div className="my-10 h-[80%] w-5/6 gap-2 overflow-y-hidden md:grid md:h-4/5 md:grid-cols-6 md:grid-rows-6 lg:my-20 lg:grid lg:h-1/2 lg:grid-cols-8 lg:grid-rows-4 lg:gap-4">
            <div className="order-1 mb-4 hidden h-full w-full bg-zinc-400 md:col-span-2 md:row-span-3 md:mb-0 md:block lg:col-span-3 lg:row-span-2">
                LeaderBoard
            </div>
            <div className="order-2 h-1/2 w-full md:col-span-4 md:row-span-3 md:h-full lg:col-span-3 lg:row-span-6">
                <PlayerLobby />
            </div>
            <div className="order-3 h-full w-full md:col-span-4 md:row-span-2 lg:order-4 lg:col-span-3 lg:row-span-4">
                <OpenGames />
            </div>
            <div className="order-4 hidden h-full w-full bg-pink-400 md:col-span-2 md:row-span-2 md:block lg:order-3 lg:col-span-2 lg:row-span-6 lg:block">
                stats/ad
            </div>
        </div>
    );
}
