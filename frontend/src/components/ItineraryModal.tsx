import { useEffect, useState } from "react"

type Props = {
    flight: any
    onClose: () => void
}

const ItineraryModal = ({ flight, onClose }: Props) => {
    const [adventurousness, setAdventurousness] = useState(5)
    const [loading, setLoading] = useState(false)
    const [itinerary, setItinerary] = useState<any[] | null>(null)
    const [error, setError] = useState("")

    const generateItinerary = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/generate-itinerary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    destination: flight.destination,
                    startDate: flight.departureTime.split("T")[0],
                    endDate: flight.returnDate?.split("T")[0] || flight.departureTime.split("T")[0],
                    passengers: flight.passengers,
                    adventurousness
                })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Unknown error")
            setItinerary(data.itinerary)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        generateItinerary()
    }, [])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-sky-700 mb-4">
                    Your Custom Itinerary ✨
                </h2>

                <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">Adventurousness: {adventurousness}</label>
                    <input
                        type="range"
                        min={0}
                        max={10}
                        value={adventurousness}
                        onChange={(e) => setAdventurousness(Number(e.target.value))}
                        className="w-full"
                    />
                </div>

                {loading && (
                    <div className="space-y-4 animate-pulse mt-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-200 rounded p-4">
                                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
                                <div className="h-3 bg-gray-300 rounded w-full mb-1" />
                                <div className="h-3 bg-gray-300 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {itinerary && (
                    <ul className="divide-y divide-gray-200 mt-4 max-h-[400px] overflow-y-auto">
                        {itinerary.map((day, index) => (
                            <li key={index} className="py-3">
                                <p className="font-bold text-sky-600">Day {day.day}: {day.title}</p>
                                <p className="text-sm text-gray-700">{day.description}</p>
                                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                    {day.highlights?.map((h: string, i: number) => (
                                        <li key={i}>{h}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ItineraryModal
