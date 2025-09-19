import { useState } from "react"

type Props = {
    onResults: (flights: any[]) => void
}

const FlightSearchForm = ({ onResults }: Props) => {
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")
    const [departureDate, setDepartureDate] = useState("")
    const [returnDate, setReturnDate] = useState("")
    const [passengers, setPassengers] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/search-flights`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    origin,
                    destination,
                    departureDate,
                    returnDate,
                    passengers
                })
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || "Unknown error")
            }
            onResults(data.flights)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded p-6 space-y-4 border border-gray-200"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Origin (e.g. CDMX)"
                    className="input"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Destination (e.g. NYC)"
                    className="input"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                />
                <input
                    type="date"
                    className="input"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    required
                />
                <input
                    type="date"
                    className="input"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                />
                <input
                    type="number"
                    min={1}
                    max={10}
                    className="input col-span-full"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    placeholder="Passengers"
                    required
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded w-full"
            >
                {loading ? "Searching..." : "Search Flights"}
            </button>
        </form>
    )
}

export default FlightSearchForm
