import { render, screen, fireEvent } from "@testing-library/react"
import ItineraryModal from "../ItineraryModal"
import { mockSuccessfulItineraryFetch, mockFailedItineraryFetch } from "../../__mocks__/fetchMock"

describe("ItineraryModal", () => {
    const mockFlight = {
        destination: "Tokyo",
        departureTime: "2025-10-01T08:00:00",
        passengers: 2
    }

    const mockOnClose = vi.fn()

    it("renders modal with title and slider", () => {
        render(<ItineraryModal flight={mockFlight} onClose={mockOnClose} />)

        expect(screen.getByText(/your custom itinerary/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Adventurousness/i)).toBeInTheDocument()
    })

    it("displays Close button and fires callback", () => {
        render(<ItineraryModal flight={mockFlight} onClose={mockOnClose} />)

        const closeBtn = screen.getAllByText(/close/i)[0]
        fireEvent.click(closeBtn)

        expect(mockOnClose).toHaveBeenCalled()
    })

    it("shows loading skeleton initially", () => {
        render(<ItineraryModal flight={mockFlight} onClose={mockOnClose} />)

        const skeletons = screen.getAllByRole("status", { hidden: true })
        expect(skeletons.length).toBeGreaterThan(0)
    })
})

describe("ItineraryModal with mocked fetch", () => {
    const mockFlight = {
        destination: "Tokyo",
        departureTime: "2025-10-01T08:00:00",
        passengers: 2
    }

    const mockOnClose = vi.fn()

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it("displays itinerary returned by Claude", async () => {
        mockSuccessfulItineraryFetch()
        render(<ItineraryModal flight={mockFlight} onClose={mockOnClose} />)

        await waitFor(() => {
            expect(screen.getByText(/Arrival and City Walk/i)).toBeInTheDocument()
            expect(screen.getByText(/Volcano Hike/i)).toBeInTheDocument()
        })
    })

    it("displays fallback error if Claude fails", async () => {
        mockFailedItineraryFetch("Claude model exploded")
        render(<ItineraryModal flight={mockFlight} onClose={mockOnClose} />)

        await waitFor(() => {
            expect(screen.getByText(/Claude model exploded/i)).toBeInTheDocument()
        })
    })
})
