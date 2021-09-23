// Creating a user
const create = async (user) => {
    try {
        let response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        return await response.json() // return response from the server as a promise
    } catch (error) {
        console.log(error)
    }
}

// Listing all users
const list = async (signal) => {
    try { 
        let response = await fetch("/api/users", {
            method: "GET",
            signal: signal
        })

        return await response.json(); // promise if it resolves successfully will return an array containing user objects
    } catch (error) {
        console.log(error)
    }
}

// Reading a user profile
// Protected route, the requesting compon. must also provide valid credentials
const read = async (params, credentials, signal) => {
    try {
        let response = await fetch(`/api/users/${params.userId}`, {
            method: "GET",
            signal: signal,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${credentials.t}` //attach JWT to the GET fetch call
            }
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

// Update user data
// protected route
const update = async (params, credentials, user) => {
    try {
        let response = await fetch(`/api/users/${params.userId}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${credentials.t}`
            },
            body: user
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

// Delete a user 
// protected route
const remove = async (params, credentials) => {
    try {
        let response = await fetch(`/api/users/${params.userId}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${credentials.t}`
            }
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

export { create, list, read, update, remove }