type Props = {
    flights: any[]
    onBuy: (flight: any) => void
}

const FlightResults = ({ flights, onBuy }: Props) => {
    if (!flights || flights.length === 0) return null

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-sky-800">Available Flights</h2>

            <ul className="grid gap-4">
                {flights.map((flight, i) => (
                    <li
                        key={i}
                        className="bg-white border border-gray-200 rounded shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <p className="text-sm text-gray-600">{flight.flightNumber} — {flight.airline}</p>
                            <p className="font-medium text-lg">
                                {flight.origin} → {flight.destination}
                            </p>
                            <p className="text-sm text-gray-500">
                                {flight.departureTime} → {flight.arrivalTime}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                Passengers: {flight.passengers}
                            </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:text-right">
                            <p className="text-sky-600 font-semibold text-lg mb-2">
                                ${flight.priceUSD} USD
                            </p>
                            <button
                                onClick={() => onBuy(flight)}
                                className="bg-sky-600 hover:bg-sky-700 text-white text-sm px-4 py-2 rounded"
                            >
                                Buy Ticket
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FlightResults
