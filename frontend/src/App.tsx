import { useState } from 'react'
import FlightSearchForm from './components/FlightSearchForm'
import FlightResults from './components/FlightResults'
import ItineraryModal from './components/ItineraryModal'

function App() {
  const [flights, setFlights] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<any | null>(null)

  return (
    <main className="min-h-screen bg-sky-50 p-4 text-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-sky-800">
          ✈️ GenAI Flight Booking
        </h1>

        <FlightSearchForm onResults={setFlights} />

        {flights.length > 0 && (
          <FlightResults
            flights={flights}
            onBuy={(flight) => {
              setSelectedFlight(flight)
              setShowModal(true)
            }}
          />
        )}

        {showModal && selectedFlight && (
          <ItineraryModal
            flight={selectedFlight}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </main>
  )
}

export default App
