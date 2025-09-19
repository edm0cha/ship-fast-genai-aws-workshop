export function mockSuccessfulItineraryFetch() {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    itinerary: [
                        {
                            day: 1,
                            title: "Arrival and City Walk",
                            description: "Explore the historic center and relax at a local cafe.",
                            highlights: ["Plaza Central", "Old Cathedral", "Rooftop Dinner"]
                        },
                        {
                            day: 2,
                            title: "Adventure Day",
                            description: "Climb the local volcano and kayak in the lake.",
                            highlights: ["Volcano Hike", "Lake Kayak", "Hot Springs"]
                        }
                    ]
                })
        } as Response)
    )
}

export function mockFailedItineraryFetch(message = "Something went wrong") {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: message })
        } as Response)
    )
}
